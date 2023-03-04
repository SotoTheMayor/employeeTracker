INSERT INTO department (name)
VALUES ("Growth"),
    ("Engineering"),
    ("Insurance"),
    ("Data"),
    ("Operations");

INSERT INTO role (title, salary, departmentId)
VALUES ("Chief Growth Officer", 200000, 1),
    ("Director of Agency Success", 150000, 1),
    ("Relationship Manager", 100000, 1),
    ("Director of Engineering", 180000, 2),
    ("Developer", 120000, 2),
    ("Chief Underwriting Officer", 200000, 3),
    ("Director of Data and Risk", 150000, 3),
    ("Underwriter", 100000, 3),
    ("Chief Data Officer", 200000, 4),
    ("Data Scientist", 150000, 4),
    ("Chief Operations Officers", 200000, 5),
    ("VP of Operations", 180000, 5),
    ("Customer Support Specialist", 80000, 5);

INSERT INTO employee (first, last, managerId, roleId)
VALUES ("Alison", "Avery", null, 1),
    ("Billie", "Bushwack", null, 4),
    ("Carolyn", "Cadwell", null, 6),
    ("Debbie", "Downer", null, 9),
    ("Elizabeth", "Eskrow", null, 11),
    ("Alfred", "Aguilar", 1, 2),
    ("Archer", "Alley", 1, 3),
    ("Beau", "Bridge", 4, 5),
    ("Cory", "Cox", 6, 7),
    ("Casper", "Callou", 6, 8),
    ("Dan", "Darkley", 9, 10),
    ("Eleanor", "Everest", 11, 12),
    ("Ernesto", "Esperanza", 11, 13);
