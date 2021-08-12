import { ThemeState } from 'styles/theme/slice/types';
import { LoginState } from 'app/pages/LoginPage/slice/types';
import { FacebookState } from 'app/pages/ProfilePage/components/Facebook/slice/types';
import { InstagramState } from 'app/pages/ProfilePage/components/Instagram/slice/types';
import { SiderState } from 'app/components/SiderContent/slice/types';
import { PlaybackState } from 'app/pages/PlaybackPage/components/slice/types';
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
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
}
