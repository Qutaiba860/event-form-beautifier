import React, { useState } from "react";
import { Calendar, Clock, MapPin, Users, DollarSign, Plus, Trash2, Building2 } from "lucide-react";

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

  const handleRemoveItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-6 shadow-lg">
            <Calendar className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Event Request Form
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Submit your event proposal with all the necessary details for approval and coordination
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Personal Information</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Full Name *</label>
                <input 
                  required 
                  placeholder="Enter your full name" 
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">AURAK Email *</label>
                <input 
                  required 
                  type="email" 
                  placeholder="your.email@aurak.ac.ae" 
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Phone Number *</label>
                <input 
                  required 
                  type="tel" 
                  placeholder="+971 XX XXX XXXX" 
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Department *</label>
                <select 
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                >
                  <option value="">Select your department</option>
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
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Event Details Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Event Details</h2>
            </div>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Event Name *</label>
                  <input 
                    required 
                    placeholder="Enter event name" 
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Host *</label>
                  <input 
                    required 
                    placeholder="Event host/organizer" 
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Event Description *</label>
                <textarea 
                  required 
                  placeholder="Describe your event in detail..." 
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground resize-none"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Event Goal *</label>
                <textarea 
                  required 
                  placeholder="What are the objectives and expected outcomes?" 
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground resize-none"
                  rows={3}
                />
              </div>

              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Event Venue *
                  </label>
                  <input 
                    required 
                    placeholder="Venue name" 
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Event Location *
                  </label>
                  <input 
                    required 
                    placeholder="Specific location/address" 
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Start Date *</label>
                    <input 
                      required 
                      type="date" 
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">End Date *</label>
                    <input 
                      required 
                      type="date" 
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Start Time *
                    </label>
                    <input 
                      required 
                      type="time" 
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      End Time *
                    </label>
                    <input 
                      required 
                      type="time" 
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Expected Number of Attendees *</label>
                <input 
                  required 
                  placeholder="Estimated attendance" 
                  type="number" 
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </div>

          

          {/* Event Classification Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Event Classification</h2>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Event Type *</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-3 p-4 border border-border rounded-xl bg-background/30 hover:bg-background/50 transition-all duration-200 cursor-pointer">
                    <input type="radio" name="type" value="University-hosted" required className="text-primary" />
                    <span className="text-foreground">University-hosted</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-border rounded-xl bg-background/30 hover:bg-background/50 transition-all duration-200 cursor-pointer">
                    <input type="radio" name="type" value="Co-hosted" required className="text-primary" />
                    <span className="text-foreground">Co-hosted</span>
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Category *</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {["Sport", "Academic", "Cultural", "Club", "Other"].map((cat) => (
                    <label key={cat} className="flex items-center gap-3 p-3 border border-border rounded-xl bg-background/30 hover:bg-background/50 transition-all duration-200 cursor-pointer">
                      <input type="checkbox" className="text-primary" />
                      <span className="text-foreground">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Target Audience *</label>
                <div className="grid grid-cols-3 gap-3">
                  {["Students", "Faculty", "Both"].map((aud) => (
                    <label key={aud} className="flex items-center gap-3 p-3 border border-border rounded-xl bg-background/30 hover:bg-background/50 transition-all duration-200 cursor-pointer">
                      <input type="checkbox" className="text-primary" />
                      <span className="text-foreground">{aud}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Resources Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Request Resources</h2>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {["Food", "Beverages", "Screens", "Markers/Pens", "Papers"].map((item) => (
                  <label key={item} className="flex items-center gap-3 p-3 border border-border rounded-xl bg-background/30 hover:bg-background/50 transition-all duration-200 cursor-pointer">
                    <input type="checkbox" className="text-primary" />
                    <span className="text-foreground">{item}</span>
                  </label>
                ))}
              </div>
              <input 
                placeholder="Other resources (specify)" 
                className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Budget Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Budget Request</h2>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Do you need a budget? *</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-3 p-4 border border-border rounded-xl bg-background/30 hover:bg-background/50 transition-all duration-200 cursor-pointer">
                    <input
                      type="radio"
                      name="budget"
                      onChange={() => setNeedsBudget(true)}
                      className="text-primary"
                    />
                    <span className="text-foreground">I need a budget</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-border rounded-xl bg-background/30 hover:bg-background/50 transition-all duration-200 cursor-pointer">
                    <input
                      type="radio"
                      name="budget"
                      onChange={() => setNeedsBudget(false)}
                      className="text-primary"
                    />
                    <span className="text-foreground">I don't need a budget</span>
                  </label>
                </div>
              </div>

              {needsBudget && (
                <div className="space-y-6 border-t pt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">Budget Items</h3>
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl hover:from-green-600 hover:to-teal-600 transition-all duration-200 shadow-lg"
                    >
                      <Plus className="w-4 h-4" />
                      Add Item
                    </button>
                  </div>

                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="relative p-6 border border-border rounded-2xl bg-background/30 backdrop-blur-sm space-y-4"
                    >
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="absolute top-4 right-4 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Item Name *</label>
                          <input
                            required
                            placeholder={`Item ${index + 1} name`}
                            className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground"
                            value={item.name}
                            onChange={(e) => handleItemChange(index, "name", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Quantity *</label>
                          <input
                            required
                            type="number"
                            placeholder="Qty"
                            className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Unit Price (AED) *</label>
                          <input
                            required
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground"
                            value={item.price}
                            onChange={(e) => handleItemChange(index, "price", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Total Price (AED) *</label>
                          <input
                            required
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground"
                            value={item.totalPrice}
                            onChange={(e) => handleItemChange(index, "totalPrice", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="px-12 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white text-lg font-semibold rounded-2xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Submit Event Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
