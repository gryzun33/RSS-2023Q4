import AppLoader from './appLoader';
import { DrawFunction } from '../../types/types';

class AppController extends AppLoader {
  getSources(callback: DrawFunction): void {
    super.getResp(
      {
        endpoint: 'sources',
      },
      callback
    );
  }

  getNews(e: Event, callback: DrawFunction): void {
    let target = e.target;
    const newsContainer = e.currentTarget;

    if (target === null || newsContainer === null) {
      throw new Error();
    } else {
      while (target !== newsContainer) {
        if (target instanceof HTMLElement && newsContainer instanceof HTMLElement) {
          if (target.classList.contains('source__item')) {
            const sourceId: string | null = target.getAttribute('data-source-id');
            if (newsContainer.getAttribute('data-source') !== sourceId) {
              if (sourceId === null) {
                throw new Error();
              } else {
                newsContainer.setAttribute('data-source', sourceId);
              }

              super.getResp(
                {
                  endpoint: 'everything',
                  options: {
                    sources: sourceId,
                  },
                },
                callback
              );
            }
            return;
          }
          target = target.parentNode;
        }
      }
    }
  }
}

export default AppController;
