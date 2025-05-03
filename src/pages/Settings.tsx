
import React, { useState } from "react";
import { useSubscribers } from "@/context/SubscriberContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Trash2, Edit, Save, X, PlusCircle } from "lucide-react";

const Settings: React.FC = () => {
  const { tags, addTag, updateTag, deleteTag } = useSubscribers();
  const [tagName, setTagName] = useState("");
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editedTagName, setEditedTagName] = useState("");

  const handleAddTag = () => {
    if (tagName.trim()) {
      addTag(tagName);
      setTagName("");
    }
  };

  const startEditing = (id: string, name: string) => {
    setEditingTagId(id);
    setEditedTagName(name);
  };

  const cancelEditing = () => {
    setEditingTagId(null);
    setEditedTagName("");
  };

  const saveTagEdit = (id: string) => {
    if (editedTagName.trim()) {
      updateTag(id, editedTagName);
      cancelEditing();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your application settings
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tag Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="New tag name"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
              />
              <Button onClick={handleAddTag}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Tag
              </Button>
            </div>

            <Separator className="my-4" />

            {tags.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No tags created yet
              </p>
            ) : (
              <div className="space-y-2">
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center justify-between p-2 border rounded-md"
                  >
                    {editingTagId === tag.id ? (
                      <div className="flex gap-2 flex-1">
                        <Input
                          value={editedTagName}
                          onChange={(e) => setEditedTagName(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && saveTagEdit(tag.id)
                          }
                          autoFocus
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => saveTagEdit(tag.id)}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={cancelEditing}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span>{tag.name}</span>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => startEditing(tag.id, tag.name)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteTag(tag.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Application Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Application Name:</span>
              <span>XPRM Subscriber Management</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Version:</span>
              <span>1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created with:</span>
              <span>Lovable AI</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
