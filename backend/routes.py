from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from models import db, User, Project, Task, Category, TaskCategory
from datetime import datetime

api_bp = Blueprint('api', __name__)

@api_bp.route('/api/projects', methods=['GET'])
@jwt_required()  # Added
def get_projects():
    user_id = get_jwt_identity()
    claims = get_jwt()
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    if claims.get('is_admin', False):  # Admin sees all projects
        projects = Project.query.paginate(page=page, per_page=per_page)
    else:  # Regular user sees only their projects
        projects = Project.query.filter_by(creator_id=user_id).paginate(page=page, per_page=per_page)
    return jsonify({
        'projects': [
            {
                'id': p.id,
                'title': p.title,
                'description': p.description,
                'created_at': p.created_at.isoformat(),
                'creator': {'id': p.creator.id, 'username': p.creator.username},
                'task_count': len(p.tasks),
                'status': p.status or 'active'
            } for p in projects.items
        ],
        'pagination': {
            'page': projects.page,
            'per_page': projects.per_page,
            'total': projects.total,
            'pages': projects.pages
        }
    }), 200

@api_bp.route('/api/projects/<int:id>', methods=['GET'])
@jwt_required()  # Added for consistency
def get_project(id):
    project = Project.query.get_or_404(id)
    user_id = get_jwt_identity()
    claims = get_jwt()
    if project.creator_id != user_id and not claims.get('is_admin', False):
        return jsonify({'error': 'You can only view projects you created or if you are an admin'}), 403
    return jsonify({
        'id': project.id,
        'title': project.title,
        'description': project.description,
        'created_at': project.created_at.isoformat(),
        'creator': {'id': project.creator.id, 'username': project.creator.username, 'email': project.creator.email},
        'tasks': [
            {
                'id': t.id,
                'title': t.title,
                'description': t.description,
                'status': t.status,
                'due_date': t.due_date.isoformat() if t.due_date else None,
                'assigned_to': {'id': t.assignee.id, 'username': t.assignee.username} if t.assignee else None,
                'categories': [{'id': c.id, 'name': c.name} for c in t.categories]
            } for t in project.tasks
        ]
    }), 200

@api_bp.route('/api/projects', methods=['POST'])
@jwt_required()
def create_project():
    user_id = get_jwt_identity()
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')

    if not title:
        return jsonify({'error': 'Title is required'}), 400

    project = Project(title=title, description=description, creator_id=user_id)
    db.session.add(project)
    db.session.commit()

    return jsonify({
        'message': 'Project created successfully',
        'project': {
            'id': project.id,
            'title': project.title,
            'description': project.description,
            'created_at': project.created_at.isoformat(),
            'creator_id': project.creator_id
        }
    }), 201

@api_bp.route('/api/projects/<int:id>', methods=['PUT'])
@jwt_required()
def update_project(id):
    user_id = get_jwt_identity()
    project = Project.query.get_or_404(id)
    if project.creator_id != user_id:
        return jsonify({'error': 'You can only update projects you created'}), 403

    data = request.get_json()
    project.title = data.get('title', project.title)
    project.description = data.get('description', project.description)
    db.session.commit()

    return jsonify({
        'message': 'Project updated successfully',
        'project': {
            'id': project.id,
            'title': project.title,
            'description': project.description,
            'created_at': project.created_at.isoformat(),
            'creator_id': project.creator_id
        }
    }), 200

@api_bp.route('/api/projects/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_project(id):
    user_id = get_jwt_identity()
    project = Project.query.get_or_404(id)
    if project.creator_id != user_id:
        return jsonify({'error': 'You can only delete projects you created'}), 403

    db.session.delete(project)
    db.session.commit()
    return jsonify({'message': 'Project deleted successfully'}), 200

@api_bp.route('/api/tasks/<int:id>', methods=['PATCH'])
@jwt_required()
def update_task(id):
    task = Task.query.get_or_404(id)
    data = request.get_json()
    status = data.get('status')
    title = data.get('title')
    description = data.get('description')
    due_date = data.get('due_date')
    assigned_to = data.get('assigned_to')
    category_ids = data.get('category_ids', [])

    if status and status not in ['pending', 'in_progress', 'completed', 'cancelled']:
        return jsonify({'error': 'Invalid status'}), 400

    if title:
        task.title = title
    if description:
        task.description = description
    if status:
        task.status = status
    if due_date:
        task.due_date = datetime.fromisoformat(due_date)
    if assigned_to:
        task.assigned_to = assigned_to

    if category_ids:
        TaskCategory.query.filter_by(task_id=task.id).delete()
        for cat_id in category_ids:
            category = Category.query.get(cat_id)
            if category:
                task_category = TaskCategory(task_id=task.id, category_id=cat_id)
                db.session.add(task_category)

    db.session.commit()

    return jsonify({
        'message': 'Task updated successfully',
        'task': {
            'id': task.id,
            'title': task.title,
            'description': task.description,
            'status': task.status,
            'due_date': task.due_date.isoformat() if task.due_date else None,
            'assigned_to': task.assigned_to,
            'categories': [{'id': c.id, 'name': c.name} for c in task.categories]
        }
    }), 200

@api_bp.route('/api/projects/<int:project_id>/tasks', methods=['POST'])
@jwt_required()
def create_task(project_id):
    user_id = get_jwt_identity()
    project = Project.query.get_or_404(project_id)
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    due_date = data.get('due_date')
    assigned_to = data.get('assigned_to')
    category_ids = data.get('category_ids', [])

    if not title:
        return jsonify({'error': 'Title is required'}), 400

    task = Task(
        title=title,
        description=description,
        due_date=datetime.fromisoformat(due_date) if due_date else None,
        project_id=project_id,
        assigned_to=assigned_to
    )
    db.session.add(task)
    db.session.flush()

    for cat_id in category_ids:
        category = Category.query.get(cat_id)
        if category:
            task_category = TaskCategory(task_id=task.id, category_id=cat_id)
            db.session.add(task_category)

    db.session.commit()

    return jsonify({
        'message': 'Task created successfully',
        'task': {
            'id': task.id,
            'title': task.title,
            'description': task.description,
            'due_date': task.due_date.isoformat() if task.due_date else None,
            'project_id': task.project_id,
            'assigned_to': task.assigned_to
        }
    }), 201

@api_bp.route('/api/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    return jsonify({
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'created_at': user.created_at.isoformat()
        },
        'projects_created': len(user.projects),
        'tasks_assigned': len(user.tasks_assigned),
        'tasks_completed': len([t for t in user.tasks_assigned if t.status == 'completed'])
    }), 200

@api_bp.route('/api/categories', methods=['GET'])
@jwt_required()
def get_categories():
    categories = Category.query.all()
    return jsonify({
        'categories': [
            {
                'id': c.id,
                'name': c.name,
                'description': c.description,
                'created_at': c.created_at.isoformat(),
                'created_by': {'id': c.creator.id, 'username': c.creator.username}
            } for c in categories
        ]
    }), 200

@api_bp.route('/api/categories', methods=['POST'])
@jwt_required()
def create_category():
    user_id = get_jwt_identity()
    data = request.get_json()
    name = data.get('name')
    description = data.get('description')

    if not name:
        return jsonify({'error': 'Name is required'}), 400
    if Category.query.filter_by(name=name).first():
        return jsonify({'error': 'Category name already exists'}), 409

    category = Category(name=name, description=description, created_by=user_id)
    db.session.add(category)
    db.session.commit()

    return jsonify({
        'message': 'Category created successfully',
        'category': {
            'id': category.id,
            'name': category.name,
            'description': category.description,
            'created_at': category.created_at.isoformat(),
            'created_by': user_id
        }
    }), 201