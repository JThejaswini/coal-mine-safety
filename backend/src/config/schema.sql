CREATE TABLE IF NOT EXISTS mines (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    location VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS zones (
    id SERIAL PRIMARY KEY,
    mine_id INTEGER NOT NULL REFERENCES mines(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inspections (
    id SERIAL PRIMARY KEY,
    zone_id INTEGER NOT NULL REFERENCES zones(id),
    inspector_id INTEGER NOT NULL REFERENCES users(id),
    inspection_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    helmet_ok BOOLEAN NOT NULL,
    gloves_ok BOOLEAN NOT NULL,
    goggles_ok BOOLEAN NOT NULL,
    equipment_ok BOOLEAN NOT NULL,
    environment_ok BOOLEAN NOT NULL,
    status VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS violations (
    id SERIAL PRIMARY KEY,
    violation_code VARCHAR(30) UNIQUE NOT NULL,
    type VARCHAR(100) NOT NULL,
    zone_id INTEGER NOT NULL REFERENCES zones(id),
    inspection_id INTEGER REFERENCES inspections(id),
    severity VARCHAR(20) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Open',
    source VARCHAR(50) NOT NULL,
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS corrective_actions (
    id SERIAL PRIMARY KEY,
    violation_id INTEGER NOT NULL REFERENCES violations(id) ON DELETE CASCADE,
    assigned_to INTEGER NOT NULL REFERENCES users(id),
    action_description TEXT NOT NULL,
    deadline DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'Pending',
    completed_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reinspections (
    id SERIAL PRIMARY KEY,
    corrective_action_id INTEGER NOT NULL REFERENCES corrective_actions(id) ON DELETE CASCADE,
    inspector_id INTEGER NOT NULL REFERENCES users(id),
    inspection_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    result VARCHAR(30) NOT NULL,
    remarks TEXT
);