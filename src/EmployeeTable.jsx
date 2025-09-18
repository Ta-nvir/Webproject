import React, { useEffect, useState } from "react";

const EditUserPage = () => {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    fetchData();
    fetch("http://localhost:3000/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));

    fetch("http://localhost:3000/cities")
      .then((res) => res.json())
      .then((data) => setCities(data));
  }, []);

  const fetchData = () => {
    fetch("http://localhost:3000/employees")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  };

  const handleEdit = (user) => {
    setEditingId(user.empid);
    setFormData({ ...user });
    // fetch areas based on selected city
    fetch(`http://localhost:3000/areas?cityid=${user.cityid}`)
      .then((res) => res.json())
      .then((data) => setAreas(data));
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:3000/users/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        fetchData();
        setEditingId(null);
        setFormData({});
      } else {
        alert("Failed to update user.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Helper: split name into first and last name for inputs
  const splitName = (fullName) => {
    if (!fullName) return { firstname: "", lastname: "" };
    const parts = fullName.split(" ");
    return {
      firstname: parts[0],
      lastname: parts.slice(1).join(" ") || "",
    };
  };

  // Helper: merge first and last name back to full name on form change
  const mergeName = (firstname, lastname) => {
    return firstname + (lastname ? " " + lastname : "");
  };

  return (
    <div className="container mt-4">
      <h2>Workers List</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>First</th>
            <th>Last</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Description</th>
            <th>City / Area</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((emp) => {
            if (editingId === emp.empid) {
              // For edit mode, split full name into first and last
              const { firstname, lastname } = splitName(formData.name);

              return (
                <tr key={emp.empid}>
                  <td>
                    <input
                      type="text"
                      name="firstname"
                      value={firstname}
                      onChange={(e) => {
                        const newFirst = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          name: mergeName(newFirst, lastname),
                        }));
                      }}
                      className="form-control form-control-sm"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="lastname"
                      value={lastname}
                      onChange={(e) => {
                        const newLast = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          name: mergeName(firstname, newLast),
                        }));
                      }}
                      className="form-control form-control-sm"
                    />
                  </td>
                  <td>
                    <input
                      type="email"
                      name="emailid"
                      value={formData.emailid || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, emailid: e.target.value })
                      }
                      className="form-control form-control-sm"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="form-control form-control-sm"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="description"
                      value={formData.description || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      className="form-control form-control-sm"
                    />
                  </td>
                  <td>
                    <select
                      name="cityid"
                      value={formData.cityid || ""}
                      onChange={(e) => {
                        const cityid = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          cityid,
                          areaid: "", // reset area
                        }));
                        fetch(`http://localhost:5000/areas?cityid=${cityid}`)
                          .then((res) => res.json())
                          .then((data) => setAreas(data));
                      }}
                      className="form-select form-select-sm mb-1"
                    >
                      <option value="">Select City</option>
                      {cities.map((c) => (
                        <option key={c.cityid} value={c.cityid}>
                          {c.city_name || c.cityname}
                        </option>
                      ))}
                    </select>

                    <select
                      name="areaid"
                      value={formData.areaid || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, areaid: e.target.value })
                      }
                      className="form-select form-select-sm"
                    >
                      <option value="">Select Area</option>
                      {areas.map((a) => (
                        <option key={a.areaid} value={a.areaid}>
                          {a.areaname}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      name="categoryid"
                      value={formData.categoryid || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, categoryid: e.target.value })
                      }
                      className="form-select form-select-sm"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.categoryid} value={cat.categoryid}>
                          {cat.categoryname}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={handleSave}
                      className="btn btn-sm btn-success me-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="btn btn-sm btn-secondary"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              );
            }

            // Display mode
            const { firstname, lastname } = splitName(emp.name);

            return (
              <tr key={emp.empid}>
                <td>{firstname}</td>
                <td>{lastname}</td>
                <td>{emp.emailid}</td>
                <td>{emp.phone}</td>
                <td>{emp.description}</td>
                <td>
                  <div className="text-muted small">{emp.city_name || emp.cityname}</div>
                  <div className="text-muted small">{emp.areaname}</div>
                </td>
                <td>{emp.categoryname}</td>
                <td>
                  <button
                    onClick={() => handleEdit(emp)}
                    className="btn btn-sm btn-primary"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EditUserPage;
