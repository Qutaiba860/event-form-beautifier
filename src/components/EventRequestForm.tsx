import React, { useState } from "react";
import { Calendar, Clock, MapPin, Users, DollarSign, Plus, Trash2, Building2 } from "lucide-react";
import { apiService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function EventRequestForm() {
  const [needsBudget, setNeedsBudget] = useState(false);
  const [items, setItems] = useState([
    { name: "", quantity: "", price: "", totalPrice: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      // Create event
      const eventData = {
        name: formData.get('eventName') as string,
        description: formData.get('description') as string,
        goals: formData.get('goals') as string,
        host: formData.get('host') as string,
        venue: formData.get('venue') as string,
        location: formData.get('location') as string,
        start_date: formData.get('startDate') as string,
        end_date: formData.get('endDate') as string,
        start_time: formData.get('startTime') as string,
        end_time: formData.get('endTime') as string,
        expected_attendees: parseInt(formData.get('expectedAttendees') as string),
        department: formData.get('department') as string,
        category: formData.get('category') as string,
        status: 'Pending'
      };

      const createdEvent = await apiService.createEvent(eventData);

      // Create budget items if needed
      if (needsBudget) {
        for (const item of items) {
          if (item.name && item.quantity && item.price && item.totalPrice) {
            await apiService.createBudget({
              item_name: item.name,
              item_quantity: parseInt(item.quantity),
              item_cost: item.price,
              total_cost: item.totalPrice,
              budget_status: 'Pending',
              event: createdEvent.id
            });
          }
        }
      }

      toast({
        title: "Success!",
        description: "Your event request has been submitted for approval.",
      });

      // Reset form
      (e.target as HTMLFormElement).reset();
      setItems([{ name: "", quantity: "", price: "", totalPrice: "" }]);
      setNeedsBudget(false);
      
      // Navigate to dashboard after submission
      navigate('/host-dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit event request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      { name: "", quantity: "", price: "", totalPrice: "" },
    ]);
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const handleRemoveItem = (index: number) => {
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
                  name="fullName"
                  required 
                  placeholder="Enter your full name" 
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">AURAK Email *</label>
                <input 
                  name="email"
                  required 
                  type="email" 
                  placeholder="your.email@aurak.ac.ae" 
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Phone Number *</label>
                <input 
                  name="phone"
                  required 
                  type="tel" 
                  placeholder="+971 XX XXX XXXX" 
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Department *</label>
                <select 
                  name="department"
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
                    name="eventName"
                    required 
                    placeholder="Enter event name" 
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Host *</label>
                  <input 
                    name="host"
                    required 
                    placeholder="Event host/organizer" 
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Event Description *</label>
                <textarea 
                  name="description"
                  required 
                  placeholder="Describe your event in detail..." 
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground resize-none"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Event Goal *</label>
                <textarea 
                  name="goals"
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
                    name="venue"
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
                    name="location"
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
                      name="startDate"
                      required 
                      type="date" 
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">End Date *</label>
                    <input 
                      name="endDate"
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
                      name="startTime"
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
                      name="endTime"
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
                  name="expectedAttendees"
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
                      <input type="radio" name="category" value={cat} required className="text-primary" />
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
              disabled={isSubmitting}
              className="px-12 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white text-lg font-semibold rounded-2xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? "Submitting..." : "Submit Event Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
