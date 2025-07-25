import { track } from '@vercel/analytics';

// Simple analytics tracking using Vercel Analytics
export const trackPageView = (url: string, title: string) => {
  track('page_view', {
    url,
    title
  });
};

// Shuffle-specific event tracking
export const trackShuffleEvent = {
  completeMove: (moveName: string, difficulty: string) => {
    track('complete_move', {
      move_name: moveName,
      difficulty
    });
  },

  setGoal: (moveName: string, difficulty: string) => {
    track('set_goal', {
      move_name: moveName,
      difficulty
    });
  },

  viewMove: (moveName: string, difficulty: string) => {
    track('view_move', {
      move_name: moveName,
      difficulty
    });
  },

  login: (method: string) => {
    track('login', {
      method
    });
  },

  uploadMove: () => {
    track('upload_move');
  },

  filterMoves: (filterType: string, filterValue: string) => {
    track('filter_moves', {
      filter_type: filterType,
      filter_value: filterValue
    });
  }
};