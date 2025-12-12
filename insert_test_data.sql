USE health;

-- username: gold
-- password: smiths 
INSERT INTO users (username, password_hash)
VALUES ('gold', 'Gold', 'Marker', 'gold@gold.ac.uk', '$2b$10$juxuwdVsFnVZHcu4F7EMde3BcmFOOnnOil6zV1cSCF98OYq31sgoC');
INSERT INTO exercises (name, body_part, difficulty, instructions)
VALUES
('Wrist Extensor Stretch', 'elbow', 'easy', 'Hold arm straight and gently pull hand downward to stretch the forearm.'),
('Shoulder External Rotation', 'shoulder', 'medium', 'Use resistance band, rotate arm outward keeping elbow close to body.'),
('Quad Strengthening Isometric', 'knee', 'easy', 'Press back of knee into the floor and hold contraction for 5 seconds.'),
('Glute Bridge', 'lower_back', 'easy', 'Lift hips upward, keep core tight, lower slowly.'),
('Hamstring Curl (Band)', 'knee', 'medium', 'Curl leg toward glutes while keeping hips stable.');
INSERT INTO logs (user_id, exercise_id, log_date, pain_level, notes)
VALUES
(1, 1, '2025-01-10', 6, 'Pain reduced after stretching'),
(1, 3, '2025-01-12', 4, 'Knee felt better, slight tightness'),
(1, 2, '2025-01-15', 5, 'Shoulder stiff at start, improved after reps');
