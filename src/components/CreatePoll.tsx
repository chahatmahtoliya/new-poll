import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X, Plus, Image, Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePollContext } from "@/context/PollContext";
import { toast } from "sonner";

const CreatePoll: React.FC = () => {
  const navigate = useNavigate();
  const { addPoll } = usePollContext();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<{ id: string; text: string }[]>([
    { id: "1", text: "" },
    { id: "2", text: "" },
  ]);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddOption = () => {
    if (options.length >= 10) {
      toast.warning("Maximum 10 options allowed");
      return;
    }
    setOptions([...options, { id: Date.now().toString(), text: "" }]);
  };

  const handleRemoveOption = (id: string) => {
    if (options.length <= 2) {
      toast.warning("At least 2 options are required");
      return;
    }
    setOptions(options.filter((option) => option.id !== id));
  };

  const handleOptionChange = (id: string, value: string) => {
    setOptions(
      options.map((option) =>
        option.id === id ? { ...option, text: value } : option
      )
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setCoverImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeCoverImage = () => {
    setCoverImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate question
    if (!question.trim()) {
      toast.error("Please enter a question");
      return;
    }

    // Validate options
    const filledOptions = options.filter((option) => option.text.trim());
    if (filledOptions.length < 2) {
      toast.error("Please provide at least 2 options");
      return;
    }

    // Create poll
    addPoll({
      question: question.trim(),
      options: filledOptions.map((option) => ({
        id: option.id,
        text: option.text.trim(),
        votes: 0,
      })),
      coverImage: coverImage,
    });

    toast.success("Poll created successfully!");
    navigate("/");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create a New Poll</CardTitle>
        <CardDescription>
          Create a poll with your question and at least 2 options.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question">Your Question</Label>
            <Input
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your question here"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Cover Image</Label>
            <div className="flex flex-col items-center space-y-3">
              {coverImage ? (
                <div className="relative w-full">
                  <img 
                    src={coverImage} 
                    alt="Poll cover" 
                    className="w-full h-48 object-cover rounded-md border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500/90 hover:bg-red-600"
                    onClick={removeCoverImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div 
                  onClick={triggerFileInput}
                  className="w-full h-48 border-2 border-dashed rounded-md border-gray-300 hover:border-primary flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <Image className="h-12 w-12 text-gray-400 mb-2" />
                  <div className="text-sm text-gray-600">Click to upload a cover image</div>
                  <div className="text-xs text-gray-500 mt-1">PNG, JPG or WEBP (max 2MB)</div>
                  <Button type="button" variant="ghost" size="sm" className="mt-2 text-primary">
                    <Upload className="h-4 w-4 mr-2" />
                    Browse files
                  </Button>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/png, image/jpeg, image/webp" 
                className="hidden" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Options</Label>
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Input
                    value={option.text}
                    onChange={(e) => handleOptionChange(option.id, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="w-full"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveOption(option.id)}
                    disabled={options.length <= 2}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddOption}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Option
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => navigate("/")}>
            Cancel
          </Button>
          <Button type="submit">Create Poll</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CreatePoll;
