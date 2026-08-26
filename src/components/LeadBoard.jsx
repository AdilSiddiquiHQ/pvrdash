import React from 'react';
import LeadCard from './LeadCard';

export default function LeadBoard({ leads, activeFounder, onStatusUpdate }) {
  const columns = [
    { id: 'Phase 1', title: 'Phase 1: Cold Pitch', description: 'Initial hook & offer sent' },
    { id: 'Phase 2', title: 'Phase 2: Follow-Up #1', description: 'Tactical question (48h)' },
    { id: 'Phase 3', title: 'Phase 3: Follow-Up #2', description: 'Sample Loom video (48h)' },
    { id: 'Phase 4', title: 'Phase 4: Follow-Up #3', description: 'Case study proof (48h)' },
    { id: 'Phase 5', title: 'Phase 5: Follow-Up #4', description: 'Breakup last call (7d)' },
    { id: 'Phase 6', title: 'Phase 6: No-Reply Protocol', description: 'Recycling cooling pool' },
    { id: 'Replied', title: '💬 Replied / Chatting', description: 'Active negotiation' },
    { id: 'Call Booked', title: '🤝 Call Booked', description: 'Zoom diagnostic set' }
  ];

  const getLeadsForColumn = (columnId) => {
    return leads.filter(lead => lead.outreach_status === columnId);
  };

  return (
    <div className="board-grid">
      {columns.map(col => {
        const colLeads = getLeadsForColumn(col.id);
        
        return (
          <div key={col.id} className="board-column">
            <div className="column-header">
              <h3>{col.title}</h3>
              <span className="column-count">{colLeads.length}</span>
            </div>
            <p className="column-desc">{col.description}</p>
            
            <div className="column-body">
              {colLeads.length > 0 ? (
                colLeads.map(lead => (
                  <LeadCard 
                    key={lead.lead_id} 
                    lead={lead} 
                    activeFounder={activeFounder} 
                    onStatusUpdate={onStatusUpdate} 
                  />
                ))
              ) : (
                <div className="empty-column">Empty Column</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
