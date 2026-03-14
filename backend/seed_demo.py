#!/usr/bin/env python3
"""Seed demo data for testing"""
from app.create_app import create_app
from app.extensions import db
from app.models.user import User
from app.models.workspace import Workspace
from app.models.folder import Folder
from app.models.document import Document
from app.models.tag import Tag
from datetime import datetime, timedelta
import random

app = create_app()

with app.app_context():
    # Clear existing demo data
    User.query.filter_by(email='demo@cortex.app').delete()
    db.session.commit()

    # Create demo user
    demo_user = User(
        email='demo@cortex.app',
        username='demo',
        full_name='Demo User',
        is_active=True,
        is_admin=False
    )
    demo_user.set_password('Demo@123')
    db.session.add(demo_user)
    db.session.flush()

    # Create workspaces
    workspace1 = Workspace(
        name='Personal Documents',
        description='My personal document collection',
        user_id=demo_user.id
    )
    workspace2 = Workspace(
        name='Work Projects',
        description='Work-related documents and projects',
        user_id=demo_user.id
    )
    db.session.add_all([workspace1, workspace2])
    db.session.flush()

    # Create folders
    folder1 = Folder(
        name='Invoices',
        workspace_id=workspace1.id
    )
    folder2 = Folder(
        name='Contracts',
        workspace_id=workspace1.id
    )
    folder3 = Folder(
        name='Reports',
        workspace_id=workspace2.id
    )
    db.session.add_all([folder1, folder2, folder3])
    db.session.flush()

    # Create tags
    tags = []
    tag_data = [
        ('Important', '#FF6B6B'),
        ('Review', '#4ECDC4'),
        ('Archive', '#95E1D3'),
        ('Urgent', '#FFE66D'),
        ('Completed', '#95E1D3'),
    ]
    for name, color in tag_data:
        tag = Tag(name=name, color=color, user_id=demo_user.id)
        db.session.add(tag)
        tags.append(tag)
    db.session.flush()

    # Create sample documents
    doc_data = [
        {
            'title': 'Q1 Financial Report',
            'filename': 'q1_report.pdf',
            'file_path': '/uploads/q1_report.pdf',
            'mime_type': 'application/pdf',
            'file_size': 2048576,
            'status': 'completed',
            'folder_id': folder3.id,
            'content_text': 'Q1 2026 Financial Summary\n\nRevenue: $2.5M\nExpenses: $1.8M\nNet Income: $700K\n\nKey Metrics:\n- Customer Growth: 15%\n- Market Share: 8.5%\n- ROI: 38%'
        },
        {
            'title': 'Client Contract - Acme Corp',
            'filename': 'acme_contract.docx',
            'file_path': '/uploads/acme_contract.docx',
            'mime_type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'file_size': 512000,
            'status': 'completed',
            'folder_id': folder2.id,
            'content_text': 'SERVICE AGREEMENT\n\nThis agreement is entered into between Company ABC and Acme Corporation.\n\nTerms:\n- Duration: 12 months\n- Payment: Monthly\n- Services: Consulting and Support'
        },
        {
            'title': 'Invoice #2026-001',
            'filename': 'invoice_001.pdf',
            'file_path': '/uploads/invoice_001.pdf',
            'mime_type': 'application/pdf',
            'file_size': 256000,
            'status': 'completed',
            'folder_id': folder1.id,
            'content_text': 'INVOICE\n\nInvoice #: 2026-001\nDate: March 1, 2026\nAmount Due: $5,000\n\nServices Rendered:\n- Consulting: $3,000\n- Support: $2,000'
        },
        {
            'title': 'Project Proposal - AI Integration',
            'filename': 'ai_proposal.pdf',
            'file_path': '/uploads/ai_proposal.pdf',
            'mime_type': 'application/pdf',
            'file_size': 1024000,
            'status': 'completed',
            'folder_id': folder3.id,
            'content_text': 'PROJECT PROPOSAL: AI Integration\n\nObjective: Implement AI-powered document processing\n\nScope:\n- Document OCR\n- Text Extraction\n- Sentiment Analysis\n\nTimeline: 3 months\nBudget: $50,000'
        },
        {
            'title': 'Meeting Notes - March 2026',
            'filename': 'meeting_notes.txt',
            'file_path': '/uploads/meeting_notes.txt',
            'mime_type': 'text/plain',
            'file_size': 128000,
            'status': 'processing',
            'folder_id': folder3.id,
            'content_text': 'MEETING NOTES - March 14, 2026\n\nAttendees: John, Sarah, Mike\n\nDiscussed:\n1. Q1 Performance Review\n2. New Product Launch\n3. Team Expansion Plans'
        },
        {
            'title': 'Budget Spreadsheet 2026',
            'filename': 'budget_2026.xlsx',
            'file_path': '/uploads/budget_2026.xlsx',
            'mime_type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'file_size': 512000,
            'status': 'completed',
            'folder_id': folder3.id,
            'content_text': 'BUDGET 2026\n\nDepartment Allocations:\n- Engineering: $500K\n- Sales: $300K\n- Operations: $200K\n- Marketing: $150K'
        },
    ]

    documents = []
    for i, doc_info in enumerate(doc_data):
        doc = Document(
            title=doc_info['title'],
            filename=doc_info['filename'],
            file_path=doc_info['file_path'],
            mime_type=doc_info['mime_type'],
            file_size=doc_info['file_size'],
            status=doc_info['status'],
            folder_id=doc_info['folder_id'],
            user_id=demo_user.id,
            content_text=doc_info['content_text'],
            created_at=datetime.utcnow() - timedelta(days=random.randint(1, 30))
        )
        db.session.add(doc)
        documents.append(doc)
    
    db.session.flush()

    # Assign random tags to documents
    for doc in documents:
        num_tags = random.randint(1, 3)
        doc.tags = random.sample(tags, num_tags)

    db.session.commit()
    print("✓ Demo account created successfully!")
    print("\nDemo Login Credentials:")
    print("  Email: demo@cortex.app")
    print("  Password: Demo@123")
    print("\nDemo Data:")
    print(f"  - 2 Workspaces")
    print(f"  - 3 Folders")
    print(f"  - 6 Sample Documents")
    print(f"  - 5 Tags")
