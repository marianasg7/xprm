
import React, { useState } from "react";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  PlusCircle,
  MoreHorizontal,
  Upload,
  FilePlus,
  Image,
  Calendar,
  MapPin,
  Flag,
  Star,
  Edit,
  Trash,
  Link
} from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSales } from "@/context/SalesContext";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { getStatusBadge } from "@/utils/projectUtils";

// Define the form schema for project creation/editing
const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  status: z.enum(["planned", "in-progress", "completed"]),
  description: z.string().optional(),
  locationDetails: z.string().optional(),
  castingId: z.string().optional(),
});

function Projects() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Array<any>>([]);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [projectImages, setProjectImages] = useState<Record<string, string>>({});
  const { castings, updateCasting, associateProjectWithCasting, removeProjectFromCasting } = useSales();
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [castingDialogOpen, setCastingDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [selectedCastingId, setSelectedCastingId] = useState<string | undefined>(undefined);

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      status: "planned",
      description: "",
      locationDetails: "",
      castingId: undefined,
    },
  });

  // Reset form when dialog closes
  const handleDialogChange = (open: boolean) => {
    if (!open) {
      form.reset();
      setEditingProject(null);
    }
    setProjectDialogOpen(open);
  };

  // Handle project form submission
  const onSubmit = (data: z.infer<typeof projectSchema>) => {
    if (editingProject) {
      // Update existing project
      const updatedProject = { ...editingProject, ...data };
      setProjects(projects.map(p => p.id === editingProject.id ? updatedProject : p));
      
      // Update casting association if changed
      if (data.castingId !== editingProject.castingId) {
        // Remove from old casting if existed
        if (editingProject.castingId) {
          removeProjectFromCasting(editingProject.castingId, editingProject.id);
        }
        
        // Add to new casting if selected
        if (data.castingId) {
          associateProjectWithCasting(data.castingId, editingProject.id);
        }
      }
      
      toast({
        title: "Project Updated",
        description: `${data.title} has been successfully updated.`,
      });
    } else {
      // Create new project
      const newProject = {
        id: crypto.randomUUID(),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setProjects([...projects, newProject]);
      
      // Associate with casting if selected
      if (data.castingId) {
        associateProjectWithCasting(data.castingId, newProject.id);
      }
      
      toast({
        title: "Project Created",
        description: `${data.title} has been successfully created.`,
      });
    }
    setProjectDialogOpen(false);
  };

  // Handle project deletion
  const deleteProject = (id: string, castingId?: string) => {
    // Remove from associated casting if exists
    if (castingId) {
      removeProjectFromCasting(castingId, id);
    }
    
    setProjects(projects.filter(p => p.id !== id));
    toast({
      title: "Project Deleted",
      description: "The project has been successfully deleted.",
    });
  };

  // Handle project edit
  const editProject = (project: any) => {
    setEditingProject(project);
    form.reset({
      title: project.title,
      status: project.status,
      description: project.description || "",
      locationDetails: project.locationDetails || "",
      castingId: project.castingId,
    });
    setProjectDialogOpen(true);
  };

  // Handle image upload for a project
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, projectId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setProjectImages(prev => ({ ...prev, [projectId]: imageUrl }));
        
        // Update project with image URL
        setProjects(projects.map(p => 
          p.id === projectId 
            ? { ...p, imageUrl, updatedAt: new Date() } 
            : p
        ));
        
        toast({
          title: "Image Uploaded",
          description: "Project image has been successfully uploaded.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Open dialog to associate project with casting
  const openCastingDialog = (project: any) => {
    setSelectedProject(project);
    setSelectedCastingId(project.castingId);
    setCastingDialogOpen(true);
  };

  // Handle casting association
  const handleAssociateCasting = () => {
    if (!selectedProject) return;
    
    // Remove from previous casting if existed
    if (selectedProject.castingId && selectedProject.castingId !== selectedCastingId) {
      removeProjectFromCasting(selectedProject.castingId, selectedProject.id);
    }
    
    // Add to new casting if selected
    if (selectedCastingId) {
      associateProjectWithCasting(selectedCastingId, selectedProject.id);
    }
    
    // Update project locally
    const updatedProject = { ...selectedProject, castingId: selectedCastingId };
    setProjects(projects.map(p => p.id === selectedProject.id ? updatedProject : p));
    
    toast({
      title: "Casting Association Updated",
      description: selectedCastingId 
        ? "Project has been associated with the selected casting." 
        : "Project has been removed from casting association."
    });
    
    setCastingDialogOpen(false);
  };

  // Get casting name by ID
  const getCastingName = (castingId?: string) => {
    if (!castingId) return null;
    const casting = castings.find(c => c.id === castingId);
    return casting ? casting.theme : null;
  };

  // Filter projects by status
  const plannedProjects = projects.filter(p => p.status === "planned");
  const inProgressProjects = projects.filter(p => p.status === "in-progress");
  const completedProjects = projects.filter(p => p.status === "completed");

  // Status badge components
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "planned":
        return <Badge className="bg-blue-500">Planned</Badge>;
      case "in-progress":
        return <Badge className="bg-yellow-500">In Progress</Badge>;
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage your content production projects
          </p>
        </div>
        <Dialog open={projectDialogOpen} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingProject ? "Edit Project" : "Create New Project"}</DialogTitle>
              <DialogDescription>
                {editingProject 
                  ? "Update your project details below" 
                  : "Fill in the details to create a new project"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
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
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select project status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="planned">Planned</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter project description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="locationDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location Details</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter location details"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="castingId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Associate with Casting</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a casting (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {castings.map(casting => (
                            <SelectItem key={casting.id} value={casting.id}>
                              {casting.theme}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="submit">
                    {editingProject ? "Update Project" : "Create Project"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="planned">Planned</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.length > 0 ? (
              projects.map(project => (
                <ProjectCard 
                  key={project.id} 
                  project={project}
                  imageUrl={project.imageUrl} 
                  handleImageUpload={handleImageUpload}
                  editProject={editProject}
                  deleteProject={deleteProject}
                  openCastingDialog={openCastingDialog}
                  castingName={getCastingName(project.castingId)}
                />
              ))
            ) : (
              <Card className="col-span-full">
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No projects created yet. Click "New Project" to get started.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="planned">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {plannedProjects.length > 0 ? (
              plannedProjects.map(project => (
                <ProjectCard 
                  key={project.id} 
                  project={project}
                  imageUrl={project.imageUrl}
                  handleImageUpload={handleImageUpload}
                  editProject={editProject}
                  deleteProject={deleteProject}
                  openCastingDialog={openCastingDialog}
                  castingName={getCastingName(project.castingId)}
                />
              ))
            ) : (
              <Card className="col-span-full">
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No planned projects yet.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="in-progress">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {inProgressProjects.length > 0 ? (
              inProgressProjects.map(project => (
                <ProjectCard 
                  key={project.id} 
                  project={project}
                  imageUrl={project.imageUrl}
                  handleImageUpload={handleImageUpload}
                  editProject={editProject}
                  deleteProject={deleteProject}
                  openCastingDialog={openCastingDialog}
                  castingName={getCastingName(project.castingId)}
                />
              ))
            ) : (
              <Card className="col-span-full">
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No in-progress projects yet.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="completed">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {completedProjects.length > 0 ? (
              completedProjects.map(project => (
                <ProjectCard 
                  key={project.id} 
                  project={project}
                  imageUrl={project.imageUrl}
                  handleImageUpload={handleImageUpload}
                  editProject={editProject}
                  deleteProject={deleteProject}
                  openCastingDialog={openCastingDialog}
                  castingName={getCastingName(project.castingId)}
                />
              ))
            ) : (
              <Card className="col-span-full">
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No completed projects yet.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog for associating project with a casting */}
      <Dialog open={castingDialogOpen} onOpenChange={setCastingDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Associate with Casting</DialogTitle>
            <DialogDescription>
              Select a casting to associate with this project
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Project</Label>
                <div className="font-semibold">{selectedProject?.title}</div>
              </div>
              <div className="space-y-2">
                <Label>Casting</Label>
                <Select value={selectedCastingId} onValueChange={setSelectedCastingId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a casting" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None (Remove association)</SelectItem>
                    {castings.map(casting => (
                      <SelectItem key={casting.id} value={casting.id}>
                        {casting.theme}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAssociateCasting}>
              Save Association
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface ProjectCardProps {
  project: any;
  imageUrl?: string;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, projectId: string) => void;
  editProject: (project: any) => void;
  deleteProject: (id: string, castingId?: string) => void;
  openCastingDialog: (project: any) => void;
  castingName: string | null;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  imageUrl, 
  handleImageUpload, 
  editProject, 
  deleteProject,
  openCastingDialog,
  castingName
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <Card>
      <div className="relative">
        <div 
          className="h-40 bg-muted rounded-t-lg flex items-center justify-center overflow-hidden"
        >
          {project.imageUrl ? (
            <img 
              src={project.imageUrl} 
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <Image className="h-12 w-12 text-muted-foreground opacity-50" />
          )}
        </div>
        <input 
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, project.id)}
          className="hidden"
        />
        <Button
          variant="outline"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 bg-background/80 backdrop-blur-sm"
          onClick={triggerFileInput}
        >
          <Upload className="h-4 w-4" />
        </Button>
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{project.title}</CardTitle>
            <CardDescription>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span className="text-xs">
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>
            </CardDescription>
          </div>
          <div className="flex">
            <Badge variant={getStatusBadge(project.status)}>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => editProject(project)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openCastingDialog(project)}>
                  <Link className="mr-2 h-4 w-4" /> {castingName ? "Change" : "Add"} Casting
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => deleteProject(project.id, project.castingId)}
                  className="text-red-600"
                >
                  <Trash className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {project.description && (
          <p className="text-sm mb-2">{project.description}</p>
        )}
        {project.locationDetails && (
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <MapPin className="h-3 w-3 mr-1" />
            <span>{project.locationDetails}</span>
          </div>
        )}
        {castingName && (
          <Badge variant="outline" className="flex items-center w-fit gap-1">
            <Star className="h-3 w-3" />
            <span>Casting: {castingName}</span>
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};

export default Projects;
