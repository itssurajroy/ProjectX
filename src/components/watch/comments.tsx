
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Send } from "lucide-react";

export default function Comments() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Comments</h2>
      
      {/* Post Comment Form */}
      <div className="flex gap-4 items-start">
        <Avatar>
          <AvatarImage src="https://i.pravatar.cc/150?u=user" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="w-full">
            <form className="w-full">
                <Textarea placeholder="Add a comment..." className="mb-2" />
                <div className="flex justify-end">
                <Button type="submit">
                    <Send className="mr-2 h-4 w-4" /> Post
                </Button>
                </div>
            </form>
        </div>
      </div>
      
      <div className="text-center py-8 text-muted-foreground">
        <p>Comments are coming soon!</p>
      </div>
    </div>
  );
}
