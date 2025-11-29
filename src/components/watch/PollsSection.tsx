'use client';
import { useState, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { collection, doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { Card } from '@/components/ui/card';
import { sanitizeFirestoreId } from '@/lib/utils';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';
import toast from 'react-hot-toast';

export default function PollsSection({ animeId, episodeId }: { animeId: string; episodeId: string | null}) {
  const { user } = useUser();
  const firestore = useFirestore();
  const [userVote, setUserVote] = useState<string | null>(null);
  const [pollResults, setPollResults] = useState<Record<string, number>>({});
  const episode = sanitizeFirestoreId(episodeId || '');

  const pollOptions = ['🤯 Mind-blown', '😍 Loved it', '😊 Good', '🤔 Meh', '😠 Awful'];

  useEffect(() => {
    if (!animeId || !episode || !firestore) return;
    
    setUserVote(null);
    setPollResults({});

    const pollRef = collection(firestore, 'polls', `${animeId}-${episode}`, 'votes');
    const unsub = onSnapshot(pollRef, 
        (snapshot) => {
            const results: Record<string, number> = {};
            snapshot.forEach(doc => {
                const vote = doc.data().vote;
                results[vote] = (results[vote] || 0) + 1;
            });
            setPollResults(results);
        },
        (error) => {
            const permissionError = new FirestorePermissionError({
                path: pollRef.path,
                operation: 'list',
            });
            errorEmitter.emit('permission-error', permissionError);
            setPollResults({});
        }
    );
    
    if(user && !user.isAnonymous) {
      const voteRef = doc(firestore, 'polls', `${animeId}-${episode}`, 'votes', user.uid);
      getDoc(voteRef).then(docSnap => {
        if (docSnap.exists()) {
          setUserVote(docSnap.data().vote);
        }
      }).catch(async (serverError) => {
          const permissionError = new FirestorePermissionError({
            path: voteRef.path,
            operation: 'get',
          });
          errorEmitter.emit('permission-error', permissionError);
      });
    }

    return () => unsub();
  }, [animeId, episode, user, firestore]);

  const handleVote = async (vote: string) => {
    if (!user || user.isAnonymous) return toast.error("You must be logged in to vote.");
    if (!animeId || !episode || !firestore) return;

    const voteRef = doc(firestore, 'polls', `${animeId}-${episode}`, 'votes', user.uid);
    try {
      await setDoc(voteRef, { vote });
      setUserVote(vote);
      toast.success("Your vote has been counted!");
    } catch (e: any) {
        const permissionError = new FirestorePermissionError({
            path: voteRef.path,
            operation: 'create',
            requestResourceData: { vote },
        });
        errorEmitter.emit('permission-error', permissionError);
    }
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
