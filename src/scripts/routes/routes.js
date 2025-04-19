import BookmarkPage from '../pages/bookmark/bookmark-page';
import HomePage from '../pages/home/home-page';
import LoginPage from '../pages/login/login-page';
import NewStoryPage from '../pages/new/new-story-page';
import RegisterPage from '../pages/register/register-page';
import StoryDetailPage from '../pages/story-detail/story-detail-page';
import UserHomepage from '../pages/user-homepage/user-home-page';
import {
  checkAuthenticatedRoute,
  checkUnauthenticatedRouteOnly,
} from '../utils/auth';

const routes = {
  '/': () => checkUnauthenticatedRouteOnly(new HomePage()),
  '/login': () => checkUnauthenticatedRouteOnly(new LoginPage()),
  '/register': () => checkUnauthenticatedRouteOnly(new RegisterPage()),

  '/home': () => checkAuthenticatedRoute(new UserHomepage()),
  '/stories/:id': () => checkAuthenticatedRoute(new StoryDetailPage()),
  '/new-story': () => checkAuthenticatedRoute(new NewStoryPage()),
  '/bookmark': () => checkAuthenticatedRoute(new BookmarkPage()),
};

export default routes;
