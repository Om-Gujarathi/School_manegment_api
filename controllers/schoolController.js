const db = require("../models/db"); // Assuming db is configured with pg.Pool

// Add School
exports.addSchool = async (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const result = await db.query(
      "INSERT INTO schools (name, address, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING id",
      [name, address, latitude, longitude]
    );
    res.status(201).json({
      message: "School added successfully!",
      schoolId: result.rows[0].id,
    });
  } catch (error) {
    res.status(500).json({ message: "Database error.", error });
  }
};

// List Schools
exports.listSchools = async (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res
      .status(400)
      .json({ message: "Latitude and longitude are required." });
  }

  try {
    const result = await db.query("SELECT * FROM schools");
    const schools = result.rows;

    const schoolsWithDistance = schools.map((school) => {
      const distance = calculateDistance(
        latitude,
        longitude,
        school.latitude,
        school.longitude
      );
      return { ...school, distance };
    });

    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    res.status(200).json(schoolsWithDistance);
  } catch (error) {
    res.status(500).json({ message: "Database error.", error });
  }
};

// Calculate Distance using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const toRad = (x) => (x * Math.PI) / 180;

  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}
