import { Post, Game, PostMedia, PostIsVoted } from 'interfaces';
import { UserModel } from 'models/user';
import { POST_PLACEHOLDER } from 'utils/constants';

// TODO: Set correct default data
export class PostModel implements Post {
  id = 0;
  title = '';
  description: string | null = null;
  image = POST_PLACEHOLDER;
  url = '';
  html = '';
  privacy = '';
  commentsEnabled = true;
  isVoted: PostIsVoted | null = null;
  upCount = 0;
  downCount = 0;
  commentCount = 0;
  createdDate = new Date();
  user = new UserModel();
  games: Game[] = [];
  images: PostMedia[] = [];

  fromDto = (post: Post) => {
    this.id = post.id;
    this.title = post.title;
    this.description = post.description;
    this.image = post.image;
    this.url = post.url;
    this.html = post.html;
    this.privacy = post.privacy;
    this.commentsEnabled = post.commentsEnabled;
    this.isVoted = post.isVoted;
    this.upCount = post.upCount;
    this.downCount = post.downCount;
    this.commentCount = post.commentCount;
    this.createdDate = new Date(post.createdAt);
    this.user = new UserModel().fromDto(post.user);
    this.games = post.games.map((game) => game);
    this.images = post.images.map((image) => image);
    return this;
  };

  get createdAt() {
    return this.createdDate.toISOString();
  }
}
