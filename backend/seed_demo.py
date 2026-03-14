#!/usr/bin/env python3
"""Seed demo data for testing"""
from app.create_app import create_app
from app.extensions import db
from app.models.user import User
from app.models.workspace import Workspace
from app.models.folder import Folder
from app.models.document import Document
from app.models.tag import Tag
from app.models.api_key import APIKey
from datetime import datetime, timedelta
import random

app = create_app()

with app.app_context():
    # Clear existing demo data
    demo_user = User.query.filter_by(email='demo@cortex.app').first()
    if demo_user:
        # Delete in correct order to avoid foreign key violations
        APIKey.query.filter_by(user_id=demo_user.id).delete()
        Document.query.filter_by(user_id=demo_user.id).delete()
        Folder.query.filter(Folder.workspace_id.in_(
            db.session.query(Workspace.id).filter_by(user_id=demo_user.id)
        )).delete(synchronize_session=False)
        Workspace.query.filter_by(user_id=demo_user.id).delete()
        Tag.query.filter_by(user_id=demo_user.id).delete()
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
            'content_text': 'Q1 2026 Financial Summary\n\nRevenue: $2.5M\nExpenses: $1.8M\nNet Income: $700K\n\nKey Metrics:\n- Customer Growth: 15%\n- Market Share: 8.5%\n- ROI: 38%\n\nDepartment Performance:\n- Sales: +25% YoY\n- Engineering: +10% YoY\n- Operations: +5% YoY'
        },
        {
            'title': 'Client Contract - Acme Corp',
            'filename': 'acme_contract.docx',
            'file_path': '/uploads/acme_contract.docx',
            'mime_type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'file_size': 512000,
            'status': 'completed',
            'folder_id': folder2.id,
            'content_text': 'SERVICE AGREEMENT\n\nThis agreement is entered into between Company ABC and Acme Corporation.\n\nTerms:\n- Duration: 12 months\n- Payment: Monthly\n- Services: Consulting and Support\n- Support Hours: 24/7\n- SLA: 99.9% uptime'
        },
        {
            'title': 'Invoice #2026-001',
            'filename': 'invoice_001.pdf',
            'file_path': '/uploads/invoice_001.pdf',
            'mime_type': 'application/pdf',
            'file_size': 256000,
            'status': 'completed',
            'folder_id': folder1.id,
            'content_text': 'INVOICE\n\nInvoice #: 2026-001\nDate: March 1, 2026\nAmount Due: $5,000\n\nServices Rendered:\n- Consulting: $3,000\n- Support: $2,000\n\nPayment Terms: Net 30'
        },
        {
            'title': 'Project Proposal - AI Integration',
            'filename': 'ai_proposal.pdf',
            'file_path': '/uploads/ai_proposal.pdf',
            'mime_type': 'application/pdf',
            'file_size': 1024000,
            'status': 'completed',
            'folder_id': folder3.id,
            'content_text': 'PROJECT PROPOSAL: AI Integration\n\nObjective: Implement AI-powered document processing\n\nScope:\n- Document OCR\n- Text Extraction\n- Sentiment Analysis\n- Full-text Search\n\nTimeline: 3 months\nBudget: $50,000\n\nExpected ROI: 250% in first year'
        },
        {
            'title': 'Meeting Notes - March 2026',
            'filename': 'meeting_notes.txt',
            'file_path': '/uploads/meeting_notes.txt',
            'mime_type': 'text/plain',
            'file_size': 128000,
            'status': 'completed',
            'folder_id': folder3.id,
            'content_text': 'MEETING NOTES - March 14, 2026\n\nAttendees: John, Sarah, Mike\n\nDiscussed:\n1. Q1 Performance Review - All targets met\n2. New Product Launch - Scheduled for Q2\n3. Team Expansion Plans - Hiring 5 new engineers\n4. Budget Allocation - Approved $100K for R&D'
        },
        {
            'title': 'Budget Spreadsheet 2026',
            'filename': 'budget_2026.xlsx',
            'file_path': '/uploads/budget_2026.xlsx',
            'mime_type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'file_size': 512000,
            'status': 'completed',
            'folder_id': folder3.id,
            'content_text': 'BUDGET 2026\n\nDepartment Allocations:\n- Engineering: $500K\n- Sales: $300K\n- Operations: $200K\n- Marketing: $150K\n- R&D: $100K\n\nTotal Budget: $1.25M'
        },
        {
            'title': 'Q2 Strategic Plan',
            'filename': 'q2_strategy.pdf',
            'file_path': '/uploads/q2_strategy.pdf',
            'mime_type': 'application/pdf',
            'file_size': 1536000,
            'status': 'completed',
            'folder_id': folder3.id,
            'content_text': 'Q2 2026 STRATEGIC PLAN\n\nKey Objectives:\n1. Launch new AI features\n2. Expand to 3 new markets\n3. Increase customer base by 50%\n4. Improve product performance by 30%\n\nInitiatives:\n- Marketing campaign: $50K\n- Product development: $100K\n- Sales team expansion: $75K\n\nExpected Outcomes:\n- Revenue increase: 40%\n- Customer satisfaction: 95%'
        },
        {
            'title': 'Annual Report 2025',
            'filename': 'annual_report_2025.pdf',
            'file_path': '/uploads/annual_report_2025.pdf',
            'mime_type': 'application/pdf',
            'file_size': 3072000,
            'status': 'completed',
            'folder_id': folder3.id,
            'content_text': 'ANNUAL REPORT 2025\n\nCompany Overview:\nCortex is a leading document management and AI processing platform.\n\nFinancial Performance:\n- Total Revenue: $10M\n- Net Income: $2.5M\n- Growth Rate: 150% YoY\n- Customer Count: 500+\n\nKey Achievements:\n- Launched OCR feature\n- Expanded to 5 countries\n- Hired 50 new employees\n- Secured $5M Series A funding'
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

    # Create demo API keys
    api_keys = []
    api_key_data = [
        'Production API Key',
        'Development API Key',
        'Testing API Key',
    ]
    for key_name in api_key_data:
        key = APIKey.generate_key()
        api_key = APIKey(
            name=key_name,
            key_hash=APIKey.hash_key(key),
            key_preview=APIKey.get_preview(key),
            user_id=demo_user.id,
            is_revoked=False
        )
        db.session.add(api_key)
        api_keys.append((key_name, key))

    db.session.commit()
    print("✓ Demo account created successfully!")
    print("\nDemo Login Credentials:")
    print("  Email: demo@cortex.app")
    print("  Password: Demo@123")
    print("\nDemo Data:")
    print(f"  - 2 Workspaces")
    print(f"  - 3 Folders")
    print(f"  - {len(documents)} Sample Documents")
    print(f"  - 5 Tags")
    print(f"  - 3 API Keys")
    print("\nDemo API Keys:")
    for name, key in api_keys:
        print(f"  - {name}: {key}")
