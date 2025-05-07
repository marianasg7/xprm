import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { nanoid } from 'nanoid';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Edit, Trash2, Camera, PlusCircle, Save, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useSubscribers } from "@/context/SubscriberContext";
import { formatDate, getInitials } from "@/lib/utils";

// Define types for projects, ideas and equipment
interface Project {
  id: string;
  title: string;
  description: string;
  status: 'planned' | 'in-progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  imageUrl?: string;
  locationDetails?: string;
  ideasIds: string[];
  equipmentIds: string[];
  participantsIds: string[];
}

interface Idea {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  imageUrl?: string;
  tags: string[];
  projectIds: string[];
}

interface Equipment {
  id: string;
  name: string;
  description: string;
  type: string;
  quantity: number;
  location: string;
  projectIds: string[];
  imageUrl?: string;
}

// Project form schema
const projectFormSchema = z.object({
  title: z.string().min(1, "Project title is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(['planned', 'in-progress', 'completed']),
  locationDetails: z.string().optional(),
  imageUrl: z.string().optional(),
});

// Idea form schema
const ideaFormSchema = z.object({
  title: z.string().min(1, "Idea title is required"),
  description: z.string().min(1, "Description is required"),
  tags: z.array(z.string()).default([]),
  imageUrl: z.string().optional(),
});

// Equipment form schema
const equipmentFormSchema = z.object({
  name: z.string().min(1, "Equipment name is required"),
  description: z.string().optional(),
  type: z.string().min(1, "Type is required"),
  quantity: z.number().positive("Quantity must be positive"),
  location: z.string().optional(),
  imageUrl: z.string().optional(),
});

const ProjectsPage: React.FC = () => {
  const { toast } = useToast();
  const { subscribers } = useSubscribers();
  
  // State variables for projects, ideas, and equipment
  const [projects, setProjects] = useState<Project[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  
  // State variables for forms
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [isIdeaFormOpen, setIsIdeaFormOpen] = useState(false);
  const [isEquipmentFormOpen, setIsEquipmentFormOpen] = useState(false);
  
  // State variables for editing
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [ideaToEdit, setIdeaToEdit] = useState<Idea | null>(null);
  const [equipmentToEdit, setEquipmentToEdit] = useState<Equipment | null>(null);
  
  // State variables for deletion
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [ideaToDelete, setIdeaToDelete] = useState<string | null>(null);
  const [equipmentToDelete, setEquipmentToDelete] = useState<string | null>(null);
  
  // State variables for image uploading
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [imageUploadFor, setImageUploadFor] = useState<{ type: 'project' | 'idea' | 'equipment', id?: string } | null>(null);

  // Form hooks
  const projectForm = useForm<z.infer<typeof projectFormSchema>>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "planned",
      locationDetails: "",
      imageUrl: "",
    },
  });

  const ideaForm = useForm<z.infer<typeof ideaFormSchema>>({
    resolver: zodResolver(ideaFormSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: [],
      imageUrl: "",
    },
  });

  const equipmentForm = useForm<z.infer<typeof equipmentFormSchema>>({
    resolver: zodResolver(equipmentFormSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "",
      quantity: 1,
      location: "",
      imageUrl: "",
    },
  });

  // Handlers for project form
  const handleAddProject = (data: z.infer<typeof projectFormSchema>) => {
    const newProject: Project = {
      id: nanoid(),
      title: data.title,
      description: data.description,
      status: data.status,
      locationDetails: data.locationDetails || "",
      imageUrl: data.imageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
      ideasIds: [],
      equipmentIds: [],
      participantsIds: [],
    };

    setProjects([...projects, newProject]);
    setIsProjectFormOpen(false);
    projectForm.reset();

    toast({
      title: "Project created",
      description: `Project "${data.title}" has been created.`,
    });
  };

  const handleEditProject = (data: z.infer<typeof projectFormSchema>) => {
    if (projectToEdit) {
      const updatedProjects = projects.map((project) => 
        project.id === projectToEdit.id ? 
        { 
          ...project, 
          title: data.title,
          description: data.description,
          status: data.status,
          locationDetails: data.locationDetails || "",
          imageUrl: data.imageUrl,
          updatedAt: new Date() 
        } : 
        project
      );
      
      setProjects(updatedProjects);
      setProjectToEdit(null);
      setIsProjectFormOpen(false);
      projectForm.reset();
      
      toast({
        title: "Project updated",
        description: `Project "${data.title}" has been updated.`,
      });
    }
  };

  const handleDeleteProject = () => {
    if (projectToDelete) {
      setProjects(projects.filter(project => project.id !== projectToDelete));
      setProjectToDelete(null);

      // Remove project reference from ideas and equipment
      const updatedIdeas = ideas.map(idea => ({
        ...idea,
        projectIds: idea.projectIds.filter(id => id !== projectToDelete)
      }));
      setIdeas(updatedIdeas);

      const updatedEquipment = equipment.map(equip => ({
        ...equip,
        projectIds: equip.projectIds.filter(id => id !== projectToDelete)
      }));
      setEquipment(updatedEquipment);
      
      toast({
        title: "Project deleted",
        description: "The project has been deleted.",
      });
    }
  };

  // Handlers for idea form
  const handleAddIdea = (data: z.infer<typeof ideaFormSchema>) => {
    const newIdea: Idea = {
      id: nanoid(),
      title: data.title,
      description: data.description,
      tags: data.tags || [],
      imageUrl: data.imageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
      projectIds: [],
    };

    setIdeas([...ideas, newIdea]);
    setIsIdeaFormOpen(false);
    ideaForm.reset();

    toast({
      title: "Idea created",
      description: `Idea "${data.title}" has been created.`,
    });
  };

  const handleEditIdea = (data: z.infer<typeof ideaFormSchema>) => {
    if (ideaToEdit) {
      const updatedIdeas = ideas.map((idea) => 
        idea.id === ideaToEdit.id ? 
        { 
          ...idea,
          title: data.title,
          description: data.description,
          tags: data.tags || [],
          imageUrl: data.imageUrl,
          updatedAt: new Date() 
        } : 
        idea
      );
      
      setIdeas(updatedIdeas);
      setIdeaToEdit(null);
      setIsIdeaFormOpen(false);
      ideaForm.reset();
      
      toast({
        title: "Idea updated",
        description: `Idea "${data.title}" has been updated.`,
      });
    }
  };

  const handleDeleteIdea = () => {
    if (ideaToDelete) {
      setIdeas(ideas.filter(idea => idea.id !== ideaToDelete));
      setIdeaToDelete(null);

      // Remove idea reference from projects
      const updatedProjects = projects.map(project => ({
        ...project,
        ideasIds: project.ideasIds.filter(id => id !== ideaToDelete)
      }));
      setProjects(updatedProjects);
      
      toast({
        title: "Idea deleted",
        description: "The idea has been deleted.",
      });
    }
  };

  // Handlers for equipment form
  const handleAddEquipment = (data: z.infer<typeof equipmentFormSchema>) => {
    const newEquipment: Equipment = {
      id: nanoid(),
      name: data.name,
      description: data.description || "",
      type: data.type,
      quantity: data.quantity,
      location: data.location || "",
      imageUrl: data.imageUrl,
      projectIds: [],
    };

    setEquipment([...equipment, newEquipment]);
    setIsEquipmentFormOpen(false);
    equipmentForm.reset();

    toast({
      title: "Equipment added",
      description: `Equipment "${data.name}" has been added.`,
    });
  };

  const handleEditEquipment = (data: z.infer<typeof equipmentFormSchema>) => {
    if (equipmentToEdit) {
      const updatedEquipment = equipment.map((equip) => 
        equip.id === equipmentToEdit.id ? 
        { 
          ...equip,
          name: data.name,
          description: data.description || "",
          type: data.type,
          quantity: data.quantity,
          location: data.location || "",
          imageUrl: data.imageUrl 
        } : 
        equip
      );
      
      setEquipment(updatedEquipment);
      setEquipmentToEdit(null);
      setIsEquipmentFormOpen(false);
      equipmentForm.reset();
      
      toast({
        title: "Equipment updated",
        description: `Equipment "${data.name}" has been updated.`,
      });
    }
  };

  // Add the missing handleDeleteEquipment function
  const handleDeleteEquipment = () => {
    if (equipmentToDelete) {
      setEquipment(equipment.filter(equip => equip.id !== equipmentToDelete));
      setEquipmentToDelete(null);
      
      // Remove equipment reference from projects
      const updatedProjects = projects.map(project => ({
        ...project,
        equipmentIds: project.equipmentIds.filter(id => id !== equipmentToDelete)
      }));
      setProjects(updatedProjects);
      
      toast({
        title: "Equipment deleted",
        description: "The equipment has been deleted.",
      });
    }
  };

  // Image handling
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
    }
  };

  const handleSaveImage = () => {
    if (selectedImage && imageUploadFor) {
      if (imageUploadFor.type === 'project') {
        if (projectToEdit) {
          projectForm.setValue("imageUrl", selectedImage);
        } else {
          projectForm.setValue("imageUrl", selectedImage);
        }
      } else if (imageUploadFor.type === 'idea') {
        if (ideaToEdit) {
          ideaForm.setValue("imageUrl", selectedImage);
        } else {
          ideaForm.setValue("imageUrl", selectedImage);
        }
      } else if (imageUploadFor.type === 'equipment') {
        if (equipmentToEdit) {
          equipmentForm.setValue("imageUrl", selectedImage);
        } else {
          equipmentForm.setValue("imageUrl", selectedImage);
        }
      }
      setIsImageDialogOpen(false);
      setSelectedImage(null);
    }
  };

  const openImageDialog = (type: 'project' | 'idea' | 'equipment', id?: string) => {
    setImageUploadFor({ type, id });
    setIsImageDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Projects &amp; Ideas</h1>
        <p className="text-muted-foreground mt-1">
          Manage your adult content projects, ideas, and equipment
        </p>
      </div>

      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="ideas">Ideas</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Projects</h2>
            <Button onClick={() => {
              setProjectToEdit(null);
              projectForm.reset();
              setIsProjectFormOpen(true);
            }}>
              <PlusCircle className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(project => (
              <Card key={project.id} className="overflow-hidden">
                {project.imageUrl && (
                  <div className="relative h-48 w-full">
                    <img 
                      src={project.imageUrl} 
                      alt={project.title} 
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-2 left-4 right-4">
                      <h3 className="text-xl font-bold text-white">{project.title}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={project.status === 'completed' ? 'default' : 
                                  project.status === 'in-progress' ? 'secondary' : 'outline'}
                        >
                          {project.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
                <CardHeader className={project.imageUrl ? "pb-2" : ""}>
                  {!project.imageUrl && (
                    <>
                      <CardTitle>{project.title}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={project.status === 'completed' ? 'default' : 
                                  project.status === 'in-progress' ? 'secondary' : 'outline'}
                        >
                          {project.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    </>
                  )}
                  <CardDescription className="mt-2">
                    {project.description.length > 100 
                      ? `${project.description.substring(0, 100)}...` 
                      : project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {project.locationDetails && (
                    <div className="mb-2">
                      <span className="text-sm font-medium">Location:</span>
                      <span className="text-sm text-muted-foreground ml-2">{project.locationDetails}</span>
                    </div>
                  )}
                  
                  {/* Ideas related to this project */}
                  {project.ideasIds.length > 0 && (
                    <div className="mb-2">
                      <span className="text-sm font-medium">Ideas:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {project.ideasIds.map(ideaId => {
                          const idea = ideas.find(i => i.id === ideaId);
                          return idea ? (
                            <Badge key={idea.id} variant="outline">
                              {idea.title}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* Equipment related to this project */}
                  {project.equipmentIds.length > 0 && (
                    <div className="mb-2">
                      <span className="text-sm font-medium">Equipment:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {project.equipmentIds.map(equipId => {
                          const equip = equipment.find(e => e.id === equipId);
                          return equip ? (
                            <Badge key={equip.id} variant="outline">
                              {equip.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* Participants */}
                  {project.participantsIds.length > 0 && (
                    <div className="mt-2">
                      <span className="text-sm font-medium">Participants:</span>
                      <div className="flex -space-x-2 mt-1">
                        {project.participantsIds.map(participantId => {
                          const participant = subscribers.find(s => s.id === participantId);
                          return participant ? (
                            <Avatar key={participant.id} className="h-8 w-8 border-2 border-white">
                              {participant.photoUrl ? (
                                <AvatarImage src={participant.photoUrl} alt={participant.name} />
                              ) : (
                                <AvatarFallback className="bg-primary text-white">
                                  {getInitials(participant.name)}
                                </AvatarFallback>
                              )}
                            </Avatar>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-xs text-muted-foreground">
                    Created: {formatDate(project.createdAt)}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => {
                      const projectToUpdate = projects.find(p => p.id === project.id);
                      if (projectToUpdate) {
                        setProjectToEdit(projectToUpdate);
                        projectForm.reset({
                          title: projectToUpdate.title,
                          description: projectToUpdate.description,
                          status: projectToUpdate.status,
                          locationDetails: projectToUpdate.locationDetails || "",
                          imageUrl: projectToUpdate.imageUrl || "",
                        });
                        setIsProjectFormOpen(true);
                      }
                    }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500" onClick={() => setProjectToDelete(project.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}

            {projects.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground mb-4">No projects yet</p>
                  <Button onClick={() => {
                    setIsProjectFormOpen(true);
                    projectForm.reset();
                  }}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create First Project
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="ideas" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Content Ideas</h2>
            <Button onClick={() => {
              setIdeaToEdit(null);
              ideaForm.reset();
              setIsIdeaFormOpen(true);
            }}>
              <PlusCircle className="h-4 w-4 mr-2" />
              New Idea
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ideas.map(idea => (
              <Card key={idea.id} className="overflow-hidden">
                {idea.imageUrl && (
                  <div className="relative h-48 w-full">
                    <img 
                      src={idea.imageUrl} 
                      alt={idea.title} 
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{idea.title}</CardTitle>
                  <CardDescription>
                    {idea.description.length > 100 
                      ? `${idea.description.substring(0, 100)}...` 
                      : idea.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {idea.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {idea.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {idea.projectIds.length > 0 && (
                    <div>
                      <span className="text-sm font-medium">Used in Projects:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {idea.projectIds.map(projectId => {
                          const project = projects.find(p => p.id === projectId);
                          return project ? (
                            <Badge key={project.id} variant="outline">
                              {project.title}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-xs text-muted-foreground">
                    Created: {formatDate(idea.createdAt)}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => {
                      const ideaToUpdate = ideas.find(i => i.id === idea.id);
                      if (ideaToUpdate) {
                        setIdeaToEdit(ideaToUpdate);
                        ideaForm.reset({
                          title: ideaToUpdate.title,
                          description: ideaToUpdate.description,
                          tags: ideaToUpdate.tags || [],
                          imageUrl: ideaToUpdate.imageUrl || "",
                        });
                        setIsIdeaFormOpen(true);
                      }
                    }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500" onClick={() => setIdeaToDelete(idea.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}

            {ideas.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground mb-4">No ideas yet</p>
                  <Button onClick={() => {
                    setIsIdeaFormOpen(true);
                    ideaForm.reset();
                  }}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create First Idea
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="equipment" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Equipment</h2>
            <Button onClick={() => {
              setEquipmentToEdit(null);
              equipmentForm.reset();
              setIsEquipmentFormOpen(true);
            }}>
              <PlusCircle className="h-4 w-4 mr-2" />
              New Equipment
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {equipment.map(equip => (
              <Card key={equip.id}>
                {equip.imageUrl && (
                  <div className="relative h-48 w-full">
                    <img 
                      src={equip.imageUrl} 
                      alt={equip.name} 
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{equip.name}</CardTitle>
                  <Badge variant="outline">{equip.type}</Badge>
                </CardHeader>
                <CardContent>
                  {equip.description && (
                    <p className="mb-4 text-sm text-muted-foreground">{equip.description}</p>
                  )}
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-sm font-medium">Quantity:</span>
                      <span className="text-sm text-muted-foreground ml-2">{equip.quantity}</span>
                    </div>
                    
                    {equip.location && (
                      <div>
                        <span className="text-sm font-medium">Location:</span>
                        <span className="text-sm text-muted-foreground ml-2">{equip.location}</span>
                      </div>
                    )}
                  </div>
                  
                  {equip.projectIds.length > 0 && (
                    <div className="mt-4">
                      <span className="text-sm font-medium">Used in Projects:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {equip.projectIds.map(projectId => {
                          const project = projects.find(p => p.id === projectId);
                          return project ? (
                            <Badge key={project.id} variant="outline">
                              {project.title}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => {
                    const equipToUpdate = equipment.find(e => e.id === equip.id);
                    if (equipToUpdate) {
                      setEquipmentToEdit(equipToUpdate);
                      equipmentForm.reset({
                        name: equipToUpdate.name,
                        description: equipToUpdate.description || "",
                        type: equipToUpdate.type,
                        quantity: equipToUpdate.quantity,
                        location: equipToUpdate.location || "",
                        imageUrl: equipToUpdate.imageUrl || "",
                      });
                      setIsEquipmentFormOpen(true);
                    }
                  }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-500" onClick={() => setEquipmentToDelete(equip.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}

            {equipment.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground mb-4">No equipment added yet</p>
                  <Button onClick={() => {
                    setIsEquipmentFormOpen(true);
                    equipmentForm.reset();
                  }}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add First Equipment
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Project Form Dialog */}
      <Dialog open={isProjectFormOpen} onOpenChange={(open) => {
        if (!open) setIsProjectFormOpen(false);
      }}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{projectToEdit ? "Edit Project" : "Create New Project"}</DialogTitle>
            <DialogDescription>
              Add details for your adult content project
            </DialogDescription>
          </DialogHeader>
          
          <Form {...projectForm}>
            <form onSubmit={projectForm.handleSubmit(projectToEdit ? handleEditProject : handleAddProject)} className="space-y-6">
              <FormField
                control={projectForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={projectForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter project description" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={projectForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <select
                          className="w-full p-2 border rounded-md"
                          {...field}
                        >
                          <option value="planned">Planned</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={projectForm.control}
                  name="locationDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Where will this be filmed?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={projectForm.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Image</FormLabel>
                    <div className="flex items-center space-x-4">
                      {field.value ? (
                        <div className="relative h-20 w-20 rounded-md overflow-hidden">
                          <img 
                            src={field.value} 
                            alt="Project" 
                            className="object-cover w-full h-full"
                          />
                          <Button 
                            type="button" 
                            variant="destructive" 
                            size="icon" 
                            className="absolute top-1 right-1 h-5 w-5 rounded-full"
                            onClick={() => {
                              field.onChange("");
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="h-20 w-20 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                          <span className="text-gray-500 text-xs text-center">No image</span>
                        </div>
                      )}
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => openImageDialog('project')}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        {field.value ? "Replace" : "Upload"}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => {
                  setIsProjectFormOpen(false);
                  setProjectToEdit(null);
                }}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {projectToEdit ? "Save" : "Create Project"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Idea Form Dialog */}
      <Dialog open={isIdeaFormOpen} onOpenChange={(open) => {
        if (!open) setIsIdeaFormOpen(false);
      }}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{ideaToEdit ? "Edit Idea" : "Create New Idea"}</DialogTitle>
            <DialogDescription>
              Add details for your adult content idea
            </DialogDescription>
          </DialogHeader>
          
          <Form {...ideaForm}>
            <form onSubmit={ideaForm.handleSubmit(ideaToEdit ? handleEditIdea : handleAddIdea)} className="space-y-6">
              <FormField
                control={ideaForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Idea Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter idea title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={ideaForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter idea description" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={ideaForm.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (comma separated)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="BDSM, Outdoor, Lingerie, etc."
                        onChange={(e) => {
                          const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                          field.onChange(tags);
                        }}
                        value={(field.value || []).join(', ')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={ideaForm.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Idea Image</FormLabel>
                    <div className="flex items-center space-x-4">
                      {field.value ? (
                        <div className="relative h-20 w-20 rounded-md overflow-hidden">
                          <img 
                            src={field.value} 
                            alt="Idea" 
                            className="object-cover w-full h-full"
                          />
                          <Button 
                            type="button" 
                            variant="destructive" 
                            size="icon" 
                            className="absolute top-1 right-1 h-5 w-5 rounded-full"
                            onClick={() => {
                              field.onChange("");
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="h-20 w-20 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                          <span className="text-gray-500 text-xs text-center">No image</span>
                        </div>
                      )}
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => openImageDialog('idea')}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        {field.value ? "Replace" : "Upload"}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => {
                  setIsIdeaFormOpen(false);
                  setIdeaToEdit(null);
                }}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {ideaToEdit ? "Save" : "Create Idea"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Equipment Form Dialog */}
      <Dialog open={isEquipmentFormOpen} onOpenChange={(open) => {
        if (!open) setIsEquipmentFormOpen(false);
      }}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{equipmentToEdit ? "Edit Equipment" : "Add New Equipment"}</DialogTitle>
            <DialogDescription>
              Add details for your filming equipment
            </DialogDescription>
          </DialogHeader>
          
          <Form {...equipmentForm}>
            <form onSubmit={equipmentForm.handleSubmit(equipmentToEdit ? handleEditEquipment : handleAddEquipment)} className="space-y-6">
              <FormField
                control={equipmentForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equipment Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter equipment name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={equipmentForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Input placeholder="Camera, Lighting, Props, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={equipmentForm.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={equipmentForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter equipment description" 
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={equipmentForm.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Storage Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Where this equipment is stored" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={equipmentForm.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equipment Image</FormLabel>
                    <div className="flex items-center space-x-4">
                      {field.value ? (
                        <div className="relative h-20 w-20 rounded-md overflow-hidden">
                          <img 
                            src={field.value} 
                            alt="Equipment" 
                            className="object-cover w-full h-full"
                          />
                          <Button 
                            type="button" 
                            variant="destructive" 
                            size="icon" 
                            className="absolute top-1 right-1 h-5 w-5 rounded-full"
                            onClick={() => {
                              field.onChange("");
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="h-20 w-20 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                          <span className="text-gray-500 text-xs text-center">No image</span>
                        </div>
                      )}
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => openImageDialog('equipment')}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        {field.value ? "Replace" : "Upload"}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => {
                  setIsEquipmentFormOpen(false);
                  setEquipmentToEdit(null);
                }}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {equipmentToEdit ? "Save" : "Add Equipment"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Image Upload Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsImageDialogOpen(false);
          setSelectedImage(null);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
            <DialogDescription>
              Select an image to upload
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Label htmlFor="image">Select Image</Label>
            <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
            
            {selectedImage && (
              <div className="mt-4">
                <img 
                  src={selectedImage} 
                  alt="Selected" 
                  className="max-h-[300px] mx-auto object-contain rounded-md"
                />
              </div>
            )}
            
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsImageDialogOpen(false);
                  setSelectedImage(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveImage} disabled={!selectedImage}>
                <Save className="h-4 w-4 mr-2" />
                Save Image
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Project Confirmation */}
      <AlertDialog open={!!projectToDelete} onOpenChange={(open) => {
        if (!open) setProjectToDelete(null);
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project
              and remove all associations with ideas and equipment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProjectToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject} className="bg-red-500">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Delete Idea Confirmation */}
      <AlertDialog open={!!ideaToDelete} onOpenChange={(open) => {
        if (!open) setIdeaToDelete(null);
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this idea.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIdeaToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteIdea} className="bg-red-500">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Delete Equipment Confirmation */}
      <AlertDialog open={!!equipmentToDelete} onOpenChange={(open) => {
        if (!open) setEquipmentToDelete(null);
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this equipment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEquipmentToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEquipment} className="bg-red-500">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProjectsPage;
