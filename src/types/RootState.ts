import { ThemeState } from 'styles/theme/slice/types';
import { LoginState } from 'app/pages/LoginPage/slice/types';
import { SiderState } from 'app/components/SiderContent/slice/types';
import { PlaybackState } from 'app/pages/PlaybackPage/components/slice/types';
import { PrivacyPolicyState } from 'app/pages/PrivacyPolicyPage/slice/types';
import { EULAState } from 'app/pages/EULAPage/slice/types';
import { HomeState } from 'app/pages/HomePage/slice/types';
import { CourseState } from 'app/pages/CourseCreateUpdatePage/slice/types';
import { MyEventListState } from 'app/pages/MyEventPage/slice/types';
import { GroupState } from 'app/pages/MyGroupPage/slice/types';
import { GroupDetailState } from 'app/pages/GroupDetailPage/slice/types';
import { competitionUnitManagerState } from 'app/pages/CompetitionUnitCreateUpdatePage/slice/types';
import { PublicProfileState } from 'app/pages/PublicProfilePage/slice/types';
import { ProfileSearchState } from 'app/pages/ProfileSearchPage/slice/types';
import { SocialProfileState } from 'app/components/SocialProfile/slice/types';
import { NotificationState } from 'app/components/Notification/slice/types';
import { TrackState } from 'app/pages/MyTrackPage/slice/types';
// [IMPORT NEW CONTAINERSTATE ABOVE] < Needed for generating containers seamlessly

/* 
  Because the redux-injectors injects your reducers asynchronously somewhere in your code
  You have to declare them here manually
  Properties are optional because they are injected when the components are mounted sometime in your application's life. 
  So, not available always
*/
export interface RootState {
  theme?: ThemeState;
  login?: LoginState;
  sider?: SiderState;
  playback?: PlaybackState;
  privacyPolicy?: PrivacyPolicyState;
  eula?: EULAState;
  home?: HomeState;
  course?: CourseState;
  myEventList?: MyEventListState;
  group?: GroupState;
  groupDetail?: GroupDetailState;
  competitionUnitManager?: competitionUnitManagerState;
  publicProfile?: PublicProfileState;
  profileSearch?: ProfileSearchState;
  social: SocialProfileState;
  notification: NotificationState;
  track?: TrackState;
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
}
