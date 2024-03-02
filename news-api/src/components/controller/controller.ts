import AppLoader from './appLoader';
import { DrawFunction, SourceData, NewsList, IController } from '../../types/types';

class AppController extends AppLoader implements IController {
  public getSources(callback: DrawFunction<SourceData>, cat?: string): void {
    if (!cat) {
      super.getResp(
        {
          endpoint: 'sources',
        },
        callback
      );
    } else {
      super.getResp(
        {
          endpoint: 'sources',
          options: {
            category: cat,
          },
        },
        callback
      );
    }
  }

  public getNews(e: Event, callback: DrawFunction<NewsList>): void {
    let target: EventTarget | null = e.target;
    const newsContainer: EventTarget | null = e.currentTarget;

    if (target === null || newsContainer === null) {
      throw new Error('target is null');
    }
    while (target !== newsContainer) {
      if (target instanceof HTMLElement && newsContainer instanceof HTMLElement) {
        if (target.classList.contains('source__item')) {
          const sourceId: string | null = target.getAttribute('data-source-id');
          if (newsContainer.getAttribute('data-source') !== sourceId) {
            if (sourceId === null) {
              throw new Error('id of source is null');
            }
            newsContainer.setAttribute('data-source', sourceId);

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

export default AppController;
