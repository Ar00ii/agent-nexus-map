const MOLTBOOK_API_KEY = import.meta.env.VITE_MOLTBOOK_API_KEY || '';
const MOLTBOOK_API_BASE = import.meta.env.VITE_MOLTBOOK_API_BASE || 'https://www.moltbook.com/api/v1';

export interface MoltbookStats {
  price: { usd: number; change24h: number };
  marketCap: number;
  volume24h: number;
  holders: number;
  circulatingSupply: string;
  activeAgents: number;
  transactions: { last24h: number };
  totalPosts: number;
  totalComments: number;
  totalSubmolts: number;
}

export interface MoltbookPost {
  id: string;
  title: string;
  content: string;
  author: { name: string; id: string };
  upvotes: number;
  comments: number;
  created_at: string;
  submolt?: string;
}

export interface AgentActivity {
  agentId: string;
  name: string;
  collaborations: number;
  totalRewards: string;
  reputation: number;
  verified: boolean;
}

export interface Submolt {
  id: string;
  name: string;
  description: string;
  members: number;
  posts: number;
}

export interface Transaction {
  hash: string;
  type: string;
  from: string;
  to: string;
  amount: string;
  timestamp: number;
}

interface APIPostResponse {
  id: string;
  title?: string;
  content?: string;
  author?: { name?: string; id?: string };
  upvotes?: number;
  comment_count?: number;
  created_at: string;
  submolt?: { name?: string };
}

interface APIAgentResponse {
  id: string;
  name: string;
  stats?: { posts?: number };
  karma?: number;
  is_claimed?: boolean;
}

interface APISubmoltResponse {
  id: string;
  display_name?: string;
  name: string;
  description?: string;
  subscriber_count?: number;
}

const FALLBACK_STATS: MoltbookStats = {
  price: { usd: 0, change24h: 0 },
  marketCap: 0,
  volume24h: 0,
  holders: 17656,
  circulatingSupply: 'N/A',
  activeAgents: 17656,
  transactions: { last24h: 12160905 },
  totalPosts: 1231607,
  totalComments: 12160905,
  totalSubmolts: 100,
};

class MoltbookService {
  private async fetchAPI(endpoint: string) {
    const response = await fetch(`${MOLTBOOK_API_BASE}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${MOLTBOOK_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
  }

  async getStats(): Promise<MoltbookStats> {
    try {
      const submoltsData = await this.fetchAPI('/submolts');

      return {
        price: { usd: 0, change24h: 0 },
        marketCap: 0,
        volume24h: 0,
        holders: submoltsData.count || FALLBACK_STATS.holders,
        circulatingSupply: 'N/A',
        activeAgents: submoltsData.count || FALLBACK_STATS.activeAgents,
        transactions: { last24h: submoltsData.total_comments || FALLBACK_STATS.transactions.last24h },
        totalPosts: submoltsData.total_posts || FALLBACK_STATS.totalPosts,
        totalComments: submoltsData.total_comments || FALLBACK_STATS.totalComments,
        totalSubmolts: submoltsData.submolts?.length || FALLBACK_STATS.totalSubmolts,
      };
    } catch {
      return FALLBACK_STATS;
    }
  }

  async getRecentPosts(limit: number = 10): Promise<MoltbookPost[]> {
    return this.fetchPosts('/posts?sort=new', limit);
  }

  async getHotPosts(limit: number = 10): Promise<MoltbookPost[]> {
    return this.fetchPosts('/posts?sort=hot', limit);
  }

  async getTopPosts(limit: number = 10): Promise<MoltbookPost[]> {
    return this.fetchPosts('/posts?sort=top', limit);
  }

  async getRisingPosts(limit: number = 10): Promise<MoltbookPost[]> {
    return this.fetchPosts('/posts?sort=rising', limit);
  }

  private async fetchPosts(endpoint: string, limit: number): Promise<MoltbookPost[]> {
    try {
      const data = await this.fetchAPI(`${endpoint}&limit=${limit}`);

      if (data.success && data.posts) {
        return data.posts.map((post: APIPostResponse) => ({
          id: post.id,
          title: post.title || 'Sin título',
          content: post.content || '',
          author: {
            name: post.author?.name || 'Anonymous',
            id: post.author?.id || '',
          },
          upvotes: post.upvotes || 0,
          comments: post.comment_count || 0,
          created_at: post.created_at,
          submolt: post.submolt?.name || 'general',
        }));
      }

      return [];
    } catch {
      return [];
    }
  }

  async getTopAgents(limit: number = 5): Promise<AgentActivity[]> {
    try {
      const data = await this.fetchAPI(`/agents?sort=karma&limit=${limit}`);

      if (data.success && data.agents) {
        return data.agents.map((agent: APIAgentResponse) => ({
          agentId: agent.id,
          name: agent.name,
          collaborations: agent.stats?.posts || 0,
          totalRewards: (agent.karma || 0).toString(),
          reputation: agent.karma || 0,
          verified: agent.is_claimed || false,
        }));
      }

      return [];
    } catch {
      return [];
    }
  }

  async getSubmolts(limit: number = 5): Promise<Submolt[]> {
    try {
      const data = await this.fetchAPI('/submolts');

      if (data.success && data.submolts) {
        return data.submolts.slice(0, limit).map((submolt: APISubmoltResponse) => ({
          id: submolt.id,
          name: submolt.display_name || submolt.name,
          description: submolt.description || '',
          members: submolt.subscriber_count || 0,
          posts: 0,
        }));
      }

      return [];
    } catch {
      return [];
    }
  }

  async getRecentTransactions(limit: number = 10): Promise<Transaction[]> {
    const posts = await this.getRecentPosts(limit);
    return posts.map((p) => ({
      hash: p.id,
      type: 'post',
      from: p.author.name,
      to: p.submolt || 'general',
      amount: p.upvotes.toString(),
      timestamp: new Date(p.created_at).getTime(),
    }));
  }
}

export const moltbookService = new MoltbookService();
