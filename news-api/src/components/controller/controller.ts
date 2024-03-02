import AppLoader from './appLoader';
import { DrawFunction, SourceData, NewsList, IController, Nullable } from '../../utils/types';

enum SourceSelectors {
  ClassItem = 'source__item',
  DataID = 'data-source-id',
  DataSource = 'data-source',
}
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

      if (target.classList.contains(SourceSelectors.ClassItem)) {
        const sourceId: Nullable<string> = target.getAttribute(SourceSelectors.DataID);

        if (newsContainer.getAttribute(SourceSelectors.DataSource) === sourceId) return;

        if (sourceId === null) {
          throw new Error('id of source is null');
        }

        newsContainer.setAttribute(SourceSelectors.DataSource, sourceId);

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
