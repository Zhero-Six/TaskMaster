from app import app, db
from models import User, Project, Task, Category

with app.app_context():
    # Clear existing data (for development only)
    db.drop_all()
    db.create_all()

    # Sample seed data
    user1 = User(username="joyce_dev", email="joyce@example.com", is_admin=True)
    user1.password_hash = "secure123"  # Replace with user1.set_password("secure123") if you implement that

    project1 = Project(
        title="TaskMaster Alpha",
        description="Initial project setup",
        creator=user1
    )

    task1 = Task(
        title="Set up DB",
        description="Run migrations",
        project=project1,
        assignee=user1
    )

    category1 = Category(
        name="Setup",
        description="Environment and initial setup",
        creator=user1
    )

    task1.categories.append(category1)

    db.session.add_all([user1, project1, task1, category1])
    db.session.commit()

    print("✅ Seed complete.")
