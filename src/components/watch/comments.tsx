import { comments } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Send } from "lucide-react";

export default function Comments() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>
      
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
      
      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <Avatar>
              <AvatarImage src={comment.avatar} alt={comment.author} />
              <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">{comment.author}</p>
                <p className="text-xs text-muted-foreground">{comment.timestamp}</p>
              </div>
              <p className="mt-1 text-sm">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
