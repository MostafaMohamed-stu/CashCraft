"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Trash2, Palette } from "lucide-react"

interface Category {
  name: string
  budgetAmount: number
  color: string
}

interface AddCategoriesModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (categories: Category[]) => void
  planName: string
}

const predefinedCategories = [
  { name: "Food & Dining", color: "#ef4444" },
  { name: "Transportation", color: "#3b82f6" },
  { name: "Housing", color: "#10b981" },
  { name: "Entertainment", color: "#f59e0b" },
  { name: "Healthcare", color: "#8b5cf6" },
  { name: "Education", color: "#06b6d4" },
  { name: "Shopping", color: "#ec4899" },
  { name: "Utilities", color: "#84cc16" },
  { name: "Insurance", color: "#f97316" },
  { name: "Savings", color: "#22c55e" },
]

const colorOptions = [
  "#ef4444", "#f97316", "#f59e0b", "#84cc16", "#22c55e",
  "#06b6d4", "#3b82f6", "#8b5cf6", "#a855f7", "#ec4899",
  "#f43f5e", "#e11d48", "#be123c", "#9f1239", "#881337"
]

export function AddCategoriesModal({ isOpen, onClose, onSave, planName }: AddCategoriesModalProps) {
  const [categories, setCategories] = useState<Category[]>([])

  const addCategory = () => {
    setCategories([...categories, { name: "", budgetAmount: 0, color: "#3b82f6" }])
  }

  const removeCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index))
  }

  const updateCategory = (index: number, field: keyof Category, value: string | number) => {
    const updatedCategories = [...categories]
    updatedCategories[index] = { ...updatedCategories[index], [field]: value }
    setCategories(updatedCategories)
  }

  const addPredefinedCategory = (predefined: { name: string; color: string }) => {
    setCategories([...categories, { 
      name: predefined.name, 
      budgetAmount: 0, 
      color: predefined.color 
    }])
  }

  const handleSave = () => {
    const validCategories = categories.filter(cat => cat.name && cat.budgetAmount > 0)
    if (validCategories.length === 0) {
      alert("Please add at least one category with a budget amount!")
      return
    }
    onSave(validCategories)
  }

  const getTotalBudget = () => {
    return categories.reduce((sum, cat) => sum + (cat.budgetAmount || 0), 0)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="border-0 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Add Budget Categories</CardTitle>
                    <CardDescription className="text-blue-100">
                      Set up spending categories for "{planName}"
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Quick Add Predefined Categories */}
                <div className="space-y-3">
                  <Label className="text-lg font-semibold">Quick Add Categories</Label>
                  <div className="flex flex-wrap gap-2">
                    {predefinedCategories.map((predefined, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => addPredefinedCategory(predefined)}
                        className="flex items-center gap-2"
                        style={{ borderColor: predefined.color, color: predefined.color }}
                      >
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: predefined.color }}
                        />
                        {predefined.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Current Categories */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-semibold">Your Categories</Label>
                    <Button onClick={addCategory} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Category
                    </Button>
                  </div>

                  {categories.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Palette className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No categories added yet. Click "Add Category" to get started!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {categories.map((category, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="flex items-center gap-3 p-4 border rounded-lg bg-gray-50"
                        >
                                                     {/* Color Picker */}
                           <div className="relative">
                             <div 
                               className="w-8 h-8 rounded-full cursor-pointer border-2 border-white shadow-md"
                               style={{ backgroundColor: category.color }}
                             />
                             {typeof window !== 'undefined' && (
                               <div className="absolute top-10 left-0 z-10 bg-white border rounded-lg p-2 shadow-lg grid grid-cols-5 gap-1 w-40">
                                 {colorOptions.map((color) => (
                                   <button
                                     key={color}
                                     className="w-6 h-6 rounded-full border-2 border-white hover:scale-110 transition-transform"
                                     style={{ backgroundColor: color }}
                                     onClick={() => updateCategory(index, 'color', color)}
                                   />
                                 ))}
                               </div>
                             )}
                           </div>

                          {/* Category Name */}
                          <div className="flex-1">
                            <Input
                              placeholder="Category name"
                              value={category.name}
                              onChange={(e) => updateCategory(index, 'name', e.target.value)}
                              className="border-0 bg-transparent text-lg font-medium"
                            />
                          </div>

                          {/* Budget Amount */}
                          <div className="w-32">
                            <Input
                              type="number"
                              placeholder="0"
                              value={category.budgetAmount || ''}
                              onChange={(e) => updateCategory(index, 'budgetAmount', Number(e.target.value))}
                              className="text-right font-semibold"
                            />
                          </div>

                          {/* Remove Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCategory(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Summary */}
                {categories.length > 0 && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-blue-900">Total Budget:</span>
                      <Badge variant="secondary" className="text-lg px-3 py-1">
                        ${getTotalBudget().toLocaleString()}
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSave}
                    disabled={categories.length === 0}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Save Categories
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
