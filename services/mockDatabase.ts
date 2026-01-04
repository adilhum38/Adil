
import { Job, User, Post, Message, Comment } from '../types';
import { MOCK_FREELANCERS, MOCK_JOBS, MOCK_POSTS } from '../constants';

const USERS_KEY = 'fhkz_users';
const JOBS_KEY = 'fhkz_jobs';
const POSTS_KEY = 'fhkz_posts';
const MESSAGES_KEY = 'fhkz_messages';
const CURRENT_USER_KEY = 'fhkz_current_user';
const PORTFOLIO_LIKES_KEY = 'fhkz_portfolio_likes';

class MockDatabase {
  constructor() {
    this.init();
  }

  private init() {
    if (!localStorage.getItem(USERS_KEY)) {
      localStorage.setItem(USERS_KEY, JSON.stringify(MOCK_FREELANCERS));
    }
    if (!localStorage.getItem(JOBS_KEY)) {
      localStorage.setItem(JOBS_KEY, JSON.stringify(MOCK_JOBS));
    }
    if (!localStorage.getItem(POSTS_KEY)) {
      localStorage.setItem(POSTS_KEY, JSON.stringify(MOCK_POSTS));
    }
    if (!localStorage.getItem(MESSAGES_KEY)) {
        localStorage.setItem(MESSAGES_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(PORTFOLIO_LIKES_KEY)) {
      localStorage.setItem(PORTFOLIO_LIKES_KEY, JSON.stringify({}));
    }
  }

  getUsers(): User[] {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  }

  getJobs(): Job[] {
    const data = localStorage.getItem(JOBS_KEY);
    return data ? JSON.parse(data) : [];
  }

  getPosts(): Post[] {
    const data = localStorage.getItem(POSTS_KEY);
    return data ? JSON.parse(data) : [];
  }

  getMessages(userId: string): Message[] {
      const data = localStorage.getItem(MESSAGES_KEY);
      const all: Message[] = data ? JSON.parse(data) : [];
      return all.filter(m => m.receiverId === userId || m.senderId === userId);
  }

  getChatHistory(userId: string, otherId: string): Message[] {
      const all = this.getMessages(userId);
      return all.filter(m => 
          (m.senderId === userId && m.receiverId === otherId) || 
          (m.senderId === otherId && m.receiverId === userId)
      ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  getConversations(userId: string): { user: User, lastMessage: Message }[] {
      const messages = this.getMessages(userId);
      const conversationsMap = new Map<string, Message>();
      
      messages.forEach(m => {
          const otherId = m.senderId === userId ? m.receiverId : m.senderId;
          const existing = conversationsMap.get(otherId);
          if (!existing || new Date(m.createdAt) > new Date(existing.createdAt)) {
              conversationsMap.set(otherId, m);
          }
      });

      const users = this.getUsers();
      return Array.from(conversationsMap.entries()).map(([otherId, lastMessage]) => {
          const otherUser = users.find(u => u.id === otherId) || { id: otherId, name: 'Unknown User', avatar: '' } as User;
          return { user: otherUser, lastMessage };
      }).sort((a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime());
  }

  saveUser(user: User): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === user.id) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }
  }

  addJob(job: Job): void {
    const jobs = this.getJobs();
    jobs.unshift(job);
    localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
  }

  createPost(post: Post): Post {
    const posts = this.getPosts();
    posts.unshift(post);
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    return post;
  }

  updatePost(postId: string, content: string): void {
      const posts = this.getPosts();
      const post = posts.find(p => p.id === postId);
      if (post) {
          post.content = content;
          localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
      }
  }

  deletePost(postId: string): void {
      const posts = this.getPosts();
      const filtered = posts.filter(p => p.id !== postId);
      localStorage.setItem(POSTS_KEY, JSON.stringify(filtered));
  }

  addComment(postId: string, comment: Comment): void {
      const posts = this.getPosts();
      const post = posts.find(p => p.id === postId);
      if (post) {
          if (!post.commentList) post.commentList = [];
          post.commentList.push(comment);
          post.comments = post.commentList.length;
          localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
      }
  }

  sendMessage(message: Message): void {
      const data = localStorage.getItem(MESSAGES_KEY);
      const all: Message[] = data ? JSON.parse(data) : [];
      all.push(message);
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(all));
  }

  likePost(postId: string, userId: string): void {
    const posts = this.getPosts();
    const post = posts.find(p => p.id === postId);
    if (post) {
      if (post.isLikedByCurrentUser) {
        post.likes--;
        post.isLikedByCurrentUser = false;
      } else {
        post.likes++;
        post.isLikedByCurrentUser = true;
      }
      localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    }
  }

  likePortfolioItem(freelancerId: string, itemId: string, userId: string): void {
    const userLikes = JSON.parse(localStorage.getItem(PORTFOLIO_LIKES_KEY) || '{}');
    if (!userLikes[userId]) userLikes[userId] = [];
    
    const users = this.getUsers();
    const freelancer = users.find(u => u.id === freelancerId);
    if (!freelancer) return;

    const item = freelancer.portfolio.find(p => p.id === itemId);
    if (!item) return;

    const index = userLikes[userId].indexOf(itemId);
    if (index > -1) {
      userLikes[userId].splice(index, 1);
      item.likes = Math.max(0, (item.likes || 0) - 1);
    } else {
      userLikes[userId].push(itemId);
      item.likes = (item.likes || 0) + 1;
    }

    localStorage.setItem(PORTFOLIO_LIKES_KEY, JSON.stringify(userLikes));
    this.saveUser(freelancer);
  }

  isItemLikedByUser(itemId: string, userId: string): boolean {
    const userLikes = JSON.parse(localStorage.getItem(PORTFOLIO_LIKES_KEY) || '{}');
    return userLikes[userId] ? userLikes[userId].includes(itemId) : false;
  }

  login(email: string): User | null {
    const users = this.getUsers();
    const user = users.find(u => u.email === email); 
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return user;
    }
    return null;
  }

  register(user: User): User {
    this.saveUser(user);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  }

  logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  getCurrentUser(): User | null {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  }
}

export const db = new MockDatabase();
