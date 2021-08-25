import { ThemeState } from 'styles/theme/slice/types';
import { LoginState } from 'app/pages/LoginPage/slice/types';
import { FacebookState } from 'app/pages/ProfilePage/components/Facebook/slice/types';
import { InstagramState } from 'app/pages/ProfilePage/components/Instagram/slice/types';
import { SiderState } from 'app/components/SiderContent/slice/types';
import { PlaybackState } from 'app/pages/PlaybackPage/components/slice/types';
import { PrivacyPolicyState } from 'app/pages/PrivacyPolicyPage/slice/types';
import { EULAState } from 'app/pages/EULAPage/slice/types';
import { HomeState } from 'app/pages/HomePage/slice/types';
import { CourseState } from 'app/pages/CourseCreatePage/slice/types';
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
  facebook?: FacebookState;
  instagram?: InstagramState;
  sider?: SiderState;
  playback?: PlaybackState;
  privacyPolicy?: PrivacyPolicyState;
  eula?: EULAState;
  home?: HomeState;
  course?: CourseState;
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
}
