import { AchievementManager } from './AchievementManager';
import { GoalManager } from './GoalManager';
import { Relapse } from './Relapse';

interface FirebaseAddiction {
  id: string;
  name: string;
  image: string | null;
  relapses: Relapse[];
  hidden: boolean;
  inverseTimelineColor: boolean;
  startedAt: Date;
  createdAt: Date;
}

type UnidentifiedFirebaseAddiction = Omit<
  FirebaseAddiction,
  'id' | 'createdAt'
>;

class Addiction implements FirebaseAddiction {
  id: string;
  name: string;
  image: string | null;
  relapses: Relapse[];
  hidden: boolean;
  inverseTimelineColor: boolean;
  startedAt: Date;
  createdAt: Date;

  initialRelapse: Relapse;

  achievements: AchievementManager;
  goals: GoalManager;

  constructor(addiction: FirebaseAddiction) {
    this.id = addiction.id;
    this.name = addiction.name;
    this.image = addiction.image;
    this.hidden = addiction.hidden;
    this.inverseTimelineColor = addiction.inverseTimelineColor;
    this.startedAt = addiction.startedAt;
    this.createdAt = addiction.createdAt;

    this.initialRelapse = new Relapse({
      id: 'startedAt',
      addictionId: this.id,
      relapseAt: new Date(this.startedAt),
      createdAt: new Date(this.createdAt),
      note: '',
    });

    this.relapses = [this.initialRelapse, ...addiction.relapses].sort(
      (a, b) =>
        new Date(a.relapseAt).getTime() - new Date(b.relapseAt).getTime(),
    );

    this.goals = new GoalManager(this);
    this.achievements = new AchievementManager(this);
  }

  get lastRelapse(): Relapse {
    return this.relapses.length
      ? this.relapses[this.relapses.length - 1]
      : this.initialRelapse;
  }

  get relapseDates(): Date[] {
    return this.relapses.map(relapse => new Date(relapse.relapseAt));
  }
}

export { Addiction, FirebaseAddiction, UnidentifiedFirebaseAddiction };
