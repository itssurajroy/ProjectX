
'use client';
import { useState, useEffect } from 'react';
import { doc, collection, onSnapshot, getDoc } from 'firebase/firestore';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Card } from '@/components/ui/card';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import toast from 'react-hot-toast';
import { sanitizeFirestoreId } from '@/lib/utils';

function PollsSection({ animeId, episodeId }: { animeId: string; episodeId: string | undefined }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const [userVote, setUserVote] = useState<string | null>(null);
  const [pollResults, setPollResults] = useState<Record<string, number>>({});
  const episode = sanitizeFirestoreId(episodeId || '');

  const pollOptions = ['🤯 Mind-blown', '😍 Loved it', '😊 Good', '🤔 Meh', '😠 Awful'];
  
  const pollId = useMemoFirebase(() => {
    if(!animeId || !episode) return null;
    return `${animeId}-${episode}`;
  }, [animeId, episode]);

  const votesCollectionRef = useMemoFirebase(() => {
    if (!firestore || !pollId) return null;
    return collection(firestore, 'polls', pollId, 'votes');
  }, [firestore, pollId]);

  // Listener for vote results
  useEffect(() => {
    if (!votesCollectionRef) {
        setPollResults({});
        return;
    };
    
    const unsub = onSnapshot(votesCollectionRef, 
        (snapshot) => {
            const results: Record<string, number> = {};
            snapshot.forEach(doc => {
                const vote = doc.data().vote;
                results[vote] = (results[vote] || 0) + 1;
            });
            setPollResults(results);
        },
        (error) => {
            // This is expected if rules disallow list, but we keep it for debugging
            // We don't emit a global error because clients are not supposed to list votes.
            console.warn("Could not listen to poll results directly (this is likely intended by security rules).");
            setPollResults({}); 
        }
    );

    return () => unsub();
  }, [votesCollectionRef]);

  // Fetch user's existing vote
  useEffect(() => {
    if (!user || !firestore || !pollId) {
        setUserVote(null);
        return;
    };

    const voteRef = doc(firestore, 'polls', pollId, 'votes', user.uid);
    getDoc(voteRef).then(docSnap => {
      if (docSnap.exists()) {
        setUserVote(docSnap.data().vote);
      } else {
        setUserVote(null);
      }
    }).catch(async (serverError) => {
        // We don't emit error here because a "not-found" can be a permission error on get
        console.error("Couldn't check for existing vote.", serverError);
    });

  }, [pollId, user, firestore]);

  const handleVote = (vote: string) => {
    if (!user) return toast.error("You must be logged in to vote.");
    if (!firestore || !pollId) return;

    const voteRef = doc(firestore, 'polls', pollId, 'votes', user.uid);
    setDocumentNonBlocking(voteRef, { vote }, { merge: false });
    setUserVote(vote);
    toast.success("Your vote has been counted!");
  };

  const totalVotes = Object.values(pollResults).reduce((sum, count) => sum + count, 0);

  return (
    <Card className="p-4 bg-card/50 mb-6">
      <h2 className="font-bold text-lg mb-3">📊 Rate this episode</h2>
      <div className="flex flex-wrap gap-2">
        {pollOptions.map(option => {
          const count = pollResults[option] || 0;
          const percentage = totalVotes > 0 ? (count / totalVotes) * 100 : 0;
          return (
            <button
              key={option}
              onClick={() => handleVote(option)}
              disabled={!!userVote}
              className="flex-1 min-w-[80px] p-2 rounded-md bg-muted/50 hover:bg-muted disabled:cursor-not-allowed relative overflow-hidden text-center"
            >
              <div 
                className="absolute top-0 left-0 h-full bg-primary/30 transition-all duration-500" 
                style={{ width: `${userVote ? percentage : 0}%` }}
              />
              <span className="relative z-10 text-sm font-semibold">{option}</span>
              {userVote && <span className="relative z-10 text-xs block text-muted-foreground">{count}</span>}
            </button>
          )
        })}
      </div>
    </Card>
  )
}

export default PollsSection;
