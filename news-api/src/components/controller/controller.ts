import AppLoader from './appLoader';
import { DrawFunction, SourceData, NewsList, IController, Nullable } from '../../utils/types';

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
    let target: Nullable<EventTarget> = e.target;
    const newsContainer: EventTarget | null = e.currentTarget;

    if (!target || !newsContainer) {
      throw new Error('target is null');
    }
    while (target !== newsContainer) {
      if (!(target instanceof HTMLElement) || !(newsContainer instanceof HTMLElement)) return;

      if (target.classList.contains('source__item')) {
        const sourceId: Nullable<string> = target.getAttribute('data-source-id');

        if (newsContainer.getAttribute('data-source') === sourceId) return;

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

      target = target.parentNode;
    }
  }
}

export default AppController;
