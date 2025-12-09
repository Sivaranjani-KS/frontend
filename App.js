import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [assets, setAssets] = useState([]);
  const [form, setForm] = useState({
    name: "",
    base: "",
    type: "",
    quantity: "",
    condition: "Good",
    _id: null, // used for editing
  });

  // Fetch all assets
  const fetchAssets = async () => {
    const res = await axios.get("http://localhost:5000/api/assets");
    setAssets(res.data);
  };

  // Add or Update asset
  const saveAsset = async () => {
    if (!form.name || !form.base || !form.type || !form.quantity) {
      alert("Please fill all fields!");
      return;
    }

    if (form._id) {
      // Update
      await axios.put(`http://localhost:5000/api/assets/${form._id}`, {
        name: form.name,
        base: form.base,
        type: form.type,
        quantity: Number(form.quantity),
        condition: form.condition,
      });
    } else {
      // Add
      await axios.post("http://localhost:5000/api/assets", {
        name: form.name,
        base: form.base,
        type: form.type,
        quantity: Number(form.quantity),
        condition: form.condition,
      });
    }

    setForm({
      name: "",
      base: "",
      type: "",
      quantity: "",
      condition: "Good",
      _id: null,
    });
    fetchAssets();
  };

  // Delete asset
  const deleteAsset = async (id) => {
    if (window.confirm("Are you sure you want to delete this asset?")) {
      await axios.delete(`http://localhost:5000/api/assets/${id}`);
      fetchAssets();
    }
  };

  // Fill form for editing
  const editAsset = (asset) => {
    setForm({
      name: asset.name,
      base: asset.base,
      type: asset.type,
      quantity: asset.quantity,
      condition: asset.condition,
      _id: asset._id,
    });
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Military Asset Management System (MAMS)</h2>

      {/* Form */}
      <div
        style={{ border: "1px solid #ccc", padding: "15px", width: "350px" }}
      >
        <h3>{form._id ? "Update Asset" : "Add New Asset"}</h3>

        <input
          placeholder="Asset Name (e.g., AK-47 Rifle)"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={{ width: "100%", marginBottom: "8px" }}
        />

        <input
          placeholder="Base (e.g., Delhi HQ)"
          value={form.base}
          onChange={(e) => setForm({ ...form, base: e.target.value })}
          style={{ width: "100%", marginBottom: "8px" }}
        />

        <input
          placeholder="Equipment Type (e.g., Weapon, Vehicle)"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          style={{ width: "100%", marginBottom: "8px" }}
        />

        <input
          placeholder="Quantity"
          type="number"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          style={{ width: "100%", marginBottom: "8px" }}
        />

        <select
          value={form.condition}
          onChange={(e) => setForm({ ...form, condition: e.target.value })}
          style={{ width: "100%", marginBottom: "8px" }}
        >
          <option>Good</option>
          <option>Damaged</option>
          <option>Under Repair</option>
        </select>

        <button onClick={saveAsset} style={{ width: "100%", padding: "8px" }}>
          {form._id ? "Update Asset" : "Add Asset"}
        </button>
      </div>

      {/* Assets Table */}
      <h3 style={{ marginTop: "20px" }}>All Military Assets</h3>
      <table width="100%" border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Base</th>
            <th>Type</th>
            <th>Quantity</th>
            <th>Condition</th>
            <th>Last Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((a) => (
            <tr key={a._id}>
              <td>{a.name}</td>
              <td>{a.base}</td>
              <td>{a.type}</td>
              <td>{a.quantity}</td>
              <td>{a.condition}</td>
              <td>{new Date(a.lastUpdated).toLocaleString()}</td>
              <td>
                <button
                  onClick={() => editAsset(a)}
                  style={{ marginRight: "8px" }}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteAsset(a._id)}
                  style={{ color: "red" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
