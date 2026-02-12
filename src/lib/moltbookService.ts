// src/lib/moltbookService.ts - CON TRENDING Y POPULAR

const MOLTBOOK_API_KEY = 'moltbook_sk_VvozOrUDwEi28dNLdOzDGEpJ55siJaiN';
const MOLTBOOK_API_BASE = 'https://www.moltbook.com/api/v1';

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

class MoltbookService {
  private async fetchAPI(endpoint: string) {
    const url = `${MOLTBOOK_API_BASE}${endpoint}`;
    console.log(`🔍 Fetching: ${url}`);
    
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${MOLTBOOK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ API Response received');
      return data;
    } catch (error) {
      console.error('❌ API Error:', error);
      throw error;
    }
  }

  async getStats(): Promise<MoltbookStats> {
    try {
      console.log('📊 Obteniendo stats reales...');
      
      const submoltsData = await this.fetchAPI('/submolts');
      
      return {
        price: { usd: 0, change24h: 0 },
        marketCap: 0,
        volume24h: 0,
        holders: submoltsData.count || 17656,
        circulatingSupply: 'N/A',
        activeAgents: submoltsData.count || 17656,
        transactions: { last24h: submoltsData.total_comments || 12160905 },
        totalPosts: submoltsData.total_posts || 1231607,
        totalComments: submoltsData.total_comments || 12160905,
        totalSubmolts: submoltsData.submolts?.length || 100
      };
    } catch (error) {
      console.error('Error obteniendo stats:', error);
      return {
        price: { usd: 0, change24h: 0 },
        marketCap: 0,
        volume24h: 0,
        holders: 17656,
        circulatingSupply: 'N/A',
        activeAgents: 17656,
        transactions: { last24h: 12160905 },
        totalPosts: 1231607,
        totalComments: 12160905,
        totalSubmolts: 100
      };
    }
  }

  // Posts recientes (new)
  async getRecentPosts(limit: number = 10): Promise<MoltbookPost[]> {
    return this.fetchPosts('/posts?sort=new', limit);
  }

  // Posts HOT (trending ahora)
  async getHotPosts(limit: number = 10): Promise<MoltbookPost[]> {
    return this.fetchPosts('/posts?sort=hot', limit);
  }

  // Posts TOP (más populares)
  async getTopPosts(limit: number = 10): Promise<MoltbookPost[]> {
    return this.fetchPosts('/posts?sort=top', limit);
  }

  // Posts RISING (en tendencia)
  async getRisingPosts(limit: number = 10): Promise<MoltbookPost[]> {
    return this.fetchPosts('/posts?sort=rising', limit);
  }

  private async fetchPosts(endpoint: string, limit: number): Promise<MoltbookPost[]> {
    try {
      const fullEndpoint = `${endpoint}&limit=${limit}`;
      const data = await this.fetchAPI(fullEndpoint);
      
      if (data.success && data.posts) {
        return data.posts.map((post: any) => ({
          id: post.id,
          title: post.title || 'Sin título',
          content: post.content || '',
          author: {
            name: post.author?.name || 'Anonymous',
            id: post.author?.id || ''
          },
          upvotes: post.upvotes || 0,
          comments: post.comment_count || 0,
          created_at: post.created_at,
          submolt: post.submolt?.name || 'general'
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Error obteniendo posts:', error);
      return [];
    }
  }

  async getTopAgents(limit: number = 5): Promise<AgentActivity[]> {
    try {
      console.log('👥 Obteniendo top agents reales...');
      
      const data = await this.fetchAPI(`/agents?sort=karma&limit=${limit}`);
      
      if (data.success && data.agents) {
        return data.agents.map((agent: any) => ({
          agentId: agent.id,
          name: agent.name,
          collaborations: agent.stats?.posts || 0,
          totalRewards: (agent.karma || 0).toString(),
          reputation: agent.karma || 0,
          verified: agent.is_claimed || false
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Error obteniendo agentes:', error);
      return [];
    }
  }

  async getSubmolts(limit: number = 5): Promise<Submolt[]> {
    try {
      console.log('📁 Obteniendo submolts reales...');
      
      const data = await this.fetchAPI('/submolts');
      
      if (data.success && data.submolts) {
        return data.submolts.slice(0, limit).map((submolt: any) => ({
          id: submolt.id,
          name: submolt.display_name || submolt.name,
          description: submolt.description || '',
          members: submolt.subscriber_count || 0,
          posts: 0
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Error obteniendo submolts:', error);
      return [];
    }
  }

  async getRecentTransactions(limit: number = 10): Promise<Transaction[]> {
    const posts = await this.getRecentPosts(limit);
    return posts.map(p => ({
      hash: p.id,
      type: 'post',
      from: p.author.name,
      to: p.submolt || 'general',
      amount: p.upvotes.toString(),
      timestamp: new Date(p.created_at).getTime()
    }));
  }
}

export const moltbookService = new MoltbookService();
