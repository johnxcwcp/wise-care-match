
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { QuizQuestion, QuizQuestionOption } from "@/types";
import { toast } from "sonner";
import { Trash2, Edit, Plus, GripVertical, Download, Upload } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Badge } from "@/components/ui/badge";
import { useRef } from "react";

interface QuizManagerProps {
  questions: QuizQuestion[];
  setQuestions: (questions: QuizQuestion[]) => void;
}

const QuizManager: React.FC<QuizManagerProps> = ({ questions, setQuestions }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [newQuestion, setNewQuestion] = useState<QuizQuestion>({
    id: '',
    title: '',
    description: '',
    type: 'single',
    options: [],
    fieldName: 'specialties'
  });
  const [newOption, setNewOption] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddQuestion = () => {
    if (newQuestion.options.length === 0) {
      toast.error("You must add at least one option");
      return;
    }

    const questionWithId = {
      ...newQuestion,
      id: Date.now().toString()
    };
    
    setQuestions([...questions, questionWithId]);
    toast.success("Question added successfully");
    setNewQuestion({
      id: '',
      title: '',
      description: '',
      type: 'single',
      options: [],
      fieldName: 'specialties'
    });
    setIsAddDialogOpen(false);
  };

  const handleEditQuestion = () => {
    if (editingQuestionIndex === null) return;
    
    const currentQuestion = questions[editingQuestionIndex];
    
    if (currentQuestion.options.length === 0) {
      toast.error("You must add at least one option");
      return;
    }
    
    const updatedQuestions = [...questions];
    updatedQuestions[editingQuestionIndex] = currentQuestion;
    setQuestions(updatedQuestions);
    toast.success("Question updated successfully");
    setIsEditDialogOpen(false);
    setEditingQuestionIndex(null);
  };

  const handleDeleteQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
    toast.success("Question deleted successfully");
  };

  const handleEditClick = (index: number) => {
    setEditingQuestionIndex(index);
    setIsEditDialogOpen(true);
  };

  const handleAddOption = (currentQuestion: QuizQuestion, setCurrentQuestion: React.Dispatch<React.SetStateAction<QuizQuestion>>) => {
    if (!newOption.trim()) {
      toast.error("Option cannot be empty");
      return;
    }
    
    const option: QuizQuestionOption = {
      id: Date.now().toString(),
      label: newOption,
      value: newOption
    };
    
    setCurrentQuestion({
      ...currentQuestion,
      options: [...currentQuestion.options, option]
    });
    
    setNewOption('');
  };

  const handleDeleteOption = (
    questionIndex: number | null, 
    optionIndex: number,
    currentQuestion: QuizQuestion,
    setCurrentQuestion: React.Dispatch<React.SetStateAction<QuizQuestion>>
  ) => {
    const updatedOptions = currentQuestion.options.filter((_, i) => i !== optionIndex);
    
    setCurrentQuestion({
      ...currentQuestion,
      options: updatedOptions
    });
    
    if (questionIndex !== null) {
      // This is needed only when directly manipulating the questions array
      const updatedQuestions = [...questions];
      updatedQuestions[questionIndex].options = updatedOptions;
      setQuestions(updatedQuestions);
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const reorderedQuestions = [...questions];
    const [removed] = reorderedQuestions.splice(result.source.index, 1);
    reorderedQuestions.splice(result.destination.index, 0, removed);
    
    setQuestions(reorderedQuestions);
  };
  
  const exportQuestions = () => {
    const dataStr = JSON.stringify(questions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'quiz-questions.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importQuestions = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedQuestions = JSON.parse(content) as QuizQuestion[];
        setQuestions(importedQuestions);
        toast.success(`Successfully imported ${importedQuestions.length} questions`);
      } catch (error) {
        toast.error("Error importing questions. Please check file format.");
        console.error(error);
      }
    };
    reader.readAsText(file);
    
    // Reset input so the same file can be imported again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const QuestionForm = ({ 
    question, 
    setQuestion, 
    onSubmit,
    submitText = "Add Question"
  }: {
    question: QuizQuestion,
    setQuestion: React.Dispatch<React.SetStateAction<QuizQuestion>>,
    onSubmit: () => void,
    submitText?: string
  }) => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Question Title</Label>
        <Input 
          id="title" 
          value={question.title} 
          onChange={(e) => setQuestion({...question, title: e.target.value})} 
          required 
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea 
          id="description" 
          value={question.description || ''} 
          onChange={(e) => setQuestion({...question, description: e.target.value})} 
        />
      </div>
      
      <div>
        <Label>Answer Type</Label>
        <RadioGroup 
          value={question.type} 
          onValueChange={(value) => setQuestion({...question, type: value as 'single' | 'multiple'})}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="single" id="single" />
            <Label htmlFor="single">Single Selection</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="multiple" id="multiple" />
            <Label htmlFor="multiple">Multiple Selection</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div>
        <Label htmlFor="fieldName">Data Field Name</Label>
        <select
          id="fieldName"
          value={question.fieldName}
          onChange={(e) => setQuestion({...question, fieldName: e.target.value as any})}
          className="w-full p-2 border border-cwcp-gray rounded"
        >
          <option value="specialties">specialties</option>
          <option value="gender">gender</option>
          <option value="modalities">modalities</option>
          <option value="language">language</option>
          <option value="availability">availability</option>
          <option value="sessionType">sessionType</option>
          <option value="clientType">clientType</option>
        </select>
      </div>
      
      <div className="space-y-2">
        <Label>Options</Label>
        {question.options.map((option, i) => (
          <div key={option.id} className="flex items-center gap-2">
            <Input 
              value={option.label}
              onChange={(e) => {
                const updatedOptions = [...question.options];
                updatedOptions[i] = {
                  ...updatedOptions[i],
                  label: e.target.value,
                  value: e.target.value
                };
                setQuestion({...question, options: updatedOptions});
              }}
              className="flex-1"
            />
            <Button 
              variant="outline"
              size="icon"
              onClick={() => handleDeleteOption(null, i, question, setQuestion)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      
      <div className="flex gap-2">
        <Input 
          placeholder="Add a new option..."
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddOption(question, setQuestion);
            }
          }}
        />
        <Button 
          variant="outline"
          onClick={() => handleAddOption(question, setQuestion)}
        >
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>
      
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="button" onClick={onSubmit} disabled={question.options.length === 0}>
          {submitText}
        </Button>
      </DialogFooter>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-medium text-cwcp-blue">Quiz Questions ({questions.length})</h2>
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={importQuestions}
            accept=".json"
            className="hidden"
          />
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="w-4 h-4 mr-2" /> Import
          </Button>
          <Button variant="outline" onClick={exportQuestions}>
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" /> Add Question
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Add New Question</DialogTitle>
              </DialogHeader>
              <QuestionForm 
                question={newQuestion} 
                setQuestion={setNewQuestion} 
                onSubmit={handleAddQuestion}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="bg-white p-6 rounded-lg text-center">
          <p className="text-cwcp-darkgray">No questions added yet. Add your first question to get started.</p>
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="questions">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {questions.map((question, index) => (
                  <Draggable key={question.id} draggableId={question.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div {...provided.dragHandleProps}>
                                <GripVertical className="text-cwcp-darkgray" />
                              </div>
                              <CardTitle className="text-lg">
                                {index + 1}. {question.title}
                              </CardTitle>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={question.type === 'single' ? 'default' : 'outline'}>
                                {question.type === 'single' ? 'Single Select' : 'Multiple Select'}
                              </Badge>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditClick(index)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDeleteQuestion(index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            {question.description && (
                              <p className="text-cwcp-darkgray mb-2">{question.description}</p>
                            )}
                            <div className="text-sm font-medium text-cwcp-blue mb-2">
                              Field: {question.fieldName}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {question.options.map(option => (
                                <Badge key={option.id} variant="secondary">
                                  {option.label}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
          </DialogHeader>
          {editingQuestionIndex !== null && (
            <QuestionForm 
              question={questions[editingQuestionIndex]} 
              setQuestion={(updatedQuestion) => {
                const updatedQuestions = [...questions];
                updatedQuestions[editingQuestionIndex] = updatedQuestion as QuizQuestion;
                setQuestions(updatedQuestions);
              }}
              onSubmit={handleEditQuestion}
              submitText="Save Changes"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuizManager;
