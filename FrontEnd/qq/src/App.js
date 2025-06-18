import React, { useState } from "react";

export default function EventRequestForm() {
  const [needsBudget, setNeedsBudget] = useState(false);
  const [items, setItems] = useState([
    { name: "", quantity: "", price: "", totalPrice: "" },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted!");
    console.log("Budget Items:", items);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      { name: "", quantity: "", price: "", totalPrice: "" },
    ]);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  // Remove item handler added
  const handleRemoveItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const formGroup = "space-y-2";
  const inputClass =
    "border p-2 rounded w-full focus:ring focus:ring-blue-200";
  const labelClass = "block text-sm font-medium text-gray-700";
  const checkboxLabelClass =
    "flex items-center gap-2 text-sm text-gray-700";

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-700">
        Event Request Form
      </h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="border rounded-xl shadow-lg p-8 bg-white space-y-6">
          <div className={formGroup}>
            <input required placeholder="Name *" className={inputClass} />
          </div>
          <div className={formGroup}>
            <input
              required
              type="email"
              placeholder="AURAK E-mail *"
              className={inputClass}
            />
          </div>
          <div className={formGroup}>
            <input
              required
              type="tel"
              placeholder="Phone Number *"
              className={inputClass}
            />
          </div>
          <div className={formGroup}>
            <input required placeholder="Event Name *" className={inputClass} />
          </div>
          <div className={formGroup}>
            <textarea
              required
              placeholder="Event Description *"
              className={inputClass}
              rows="3"
            />
          </div>
          <div className={formGroup}>
            <textarea
              required
              placeholder="Event Goal *"
              className={inputClass}
              rows="3"
            />
          </div>
          <div className={formGroup}>
            <input
              required
              placeholder="Event Venue *"
              className={inputClass}
            />
          </div>
          <div className={formGroup}>
            <input
              required
              placeholder="Event Location *"
              className={inputClass}
            />
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Start Date *</label>
            <input required type="date" className={inputClass} />
          </div>
          <div className={formGroup}>
            <label className={labelClass}>End Date *</label>
            <input required type="date" className={inputClass} />
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Start Time *</label>
            <input required type="time" className={inputClass} />
          </div>
          <div className={formGroup}>
            <label className={labelClass}>End Time *</label>
            <input required type="time" className={inputClass} />
          </div>

          <div className={formGroup}>
            <input required placeholder="Host *" className={inputClass} />
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Request Resources</label>
            <div className="grid grid-cols-2 gap-2">
              {["Food", "Beverages", "Screens", "Markers/Pens", "Papers"].map(
                (item) => (
                  <label key={item} className={checkboxLabelClass}>
                    <input type="checkbox" />
                    {item}
                  </label>
                )
              )}
              <input placeholder="Other (specify)" className={inputClass} />
            </div>
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Type *</label>
            <div className="flex gap-6">
              <label className={checkboxLabelClass}>
                <input type="radio" name="type" value="University-hosted" required />
                University-hosted
              </label>
              <label className={checkboxLabelClass}>
                <input type="radio" name="type" value="Co-hosted" required />
                Co-hosted
              </label>
            </div>
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Category *</label>
            <div className="flex flex-wrap gap-3">
              {["Sport", "Academic", "Cultural", "Club", "Other"].map((cat) => (
                <label key={cat} className={checkboxLabelClass}>
                  <input type="checkbox" />
                  {cat}
                </label>
              ))}
            </div>
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Target Audience *</label>
            <div className="flex gap-3">
              {["Students", "Faculty", "Both"].map((aud) => (
                <label key={aud} className={checkboxLabelClass}>
                  <input type="checkbox" />
                  {aud}
                </label>
              ))}
            </div>
          </div>

          <div className={formGroup}>
            <input
              required
              placeholder="Expected Number of Attendees *"
              type="number"
              className={inputClass}
            />
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Department *</label>
            <select required className={inputClass}>
              {[
                "Department of Computer Science and Engineering",
                "Department of Architecture",
                "Department of Chemical and Petroleum Engineering",
                "Department of Civil and Infrastructure Engineering",
                "Department of Electrical & Electronics Engineering",
                "Department of Mechanical Engineering",
                "Department of Biotechnology",
                "Department of Humanities and Social Sciences",
                "Department of Mathematics and Physics",
                "Department of Accounting & Finance",
                "Department of Management",
              ].map((dept) => (
                <option key={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Request Budget *</label>
            <div className="flex gap-4">
              <label className={checkboxLabelClass}>
                <input
                  type="radio"
                  name="budget"
                  onChange={() => setNeedsBudget(true)}
                />
                I need a budget
              </label>
              <label className={checkboxLabelClass}>
                <input
                  type="radio"
                  name="budget"
                  onChange={() => setNeedsBudget(false)}
                />
                I don't need a budget
              </label>
            </div>
          </div>

          {needsBudget && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-medium">Budget Items</h3>

              {items.map((item, index) => (
                <div
                  key={index}
                  className="border p-4 rounded space-y-2 bg-gray-50 relative"
                >
                  <input
                    required
                    placeholder={`Item ${index + 1} Name *`}
                    className={inputClass}
                    value={item.name}
                    onChange={(e) => handleItemChange(index, "name", e.target.value)}
                  />
                  <input
                    required
                    type="number"
                    placeholder={`Item ${index + 1} Quantity *`}
                    className={inputClass}
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                  />
                  <input
                    required
                    type="number"
                    placeholder={`Item ${index + 1} Price *`}
                    className={inputClass}
                    value={item.price}
                    onChange={(e) => handleItemChange(index, "price", e.target.value)}
                  />
                  <input
                    required
                    type="number"
                    placeholder={`Total Price for Item ${index + 1} *`}
                    className={inputClass}
                    value={item.totalPrice}
                    onChange={(e) => handleItemChange(index, "totalPrice", e.target.value)}
                  />
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddItem}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mt-2"
              >
                Add More Items
              </button>
            </div>
          )}

          <div className="pt-6">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl w-full text-lg"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
