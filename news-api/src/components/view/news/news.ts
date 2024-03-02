import './news.css';
import { Article, Nullable, INews } from '../../../utils/types';
import { isType, isNull } from '../../../utils/predicats';
import { getElementInFragment } from '../../../utils/helpers';
import { NUMB_ARTICLES_ON_PAGE } from '../../../utils/constants';

enum ArticleSelectors {
  NewsItemTempSel = '#newsItemTemp',
  NewsItemSel = '.news__item',
  NewsItemPhoto = '.news__meta-photo',
  NewsAuthorSel = '.news__meta-author',
  NewsDateSel = '.news__meta-date',
  NewsTitleSel = '.news__description-title',
  NewsSourceSel = '.news__description-source',
  NewsContentSel = '.news__description-content',
  NewsLinkSel = '.news__read-more a',
}
class News implements INews {
  public draw(data: Article[]): void {
    const news: Readonly<Article[]> =
      data.length >= NUMB_ARTICLES_ON_PAGE ? data.filter((_item, idx) => idx < NUMB_ARTICLES_ON_PAGE) : data;
    const plug: Nullable<HTMLElement> = document.querySelector('.plug-text');
    if (!plug) {
      throw new Error('plug is null');
    }

    const fragment: DocumentFragment = document.createDocumentFragment();

    const newsItemTemp: Nullable<HTMLTemplateElement> = document.querySelector(ArticleSelectors.NewsItemTempSel);
    if (!isType(newsItemTemp, HTMLTemplateElement) || isNull(newsItemTemp)) {
      throw new Error('newsItemTemp is not instance of HTMLTemplateElement or equal null ');
    }

    news.forEach((item: Article, idx: number) => {
      const newsClone: Node = newsItemTemp.content.cloneNode(true);

      if (newsClone instanceof DocumentFragment) {
        const newsItem = getElementInFragment<HTMLElement>(ArticleSelectors.NewsItemSel, newsClone);
        const newsMetaPhoto = getElementInFragment<HTMLElement>(ArticleSelectors.NewsItemPhoto, newsClone);
        const newsMetaAuthor = getElementInFragment<HTMLElement>(ArticleSelectors.NewsAuthorSel, newsClone);
        const newsMetaDate = getElementInFragment<HTMLElement>(ArticleSelectors.NewsDateSel, newsClone);
        const newsTitle = getElementInFragment<HTMLElement>(ArticleSelectors.NewsTitleSel, newsClone);
        const newsSource = getElementInFragment<HTMLElement>(ArticleSelectors.NewsSourceSel, newsClone);
        const newsContent = getElementInFragment<HTMLElement>(ArticleSelectors.NewsContentSel, newsClone);
        const newsLink = getElementInFragment<HTMLElement>(ArticleSelectors.NewsLinkSel, newsClone);

        if (idx % 2) newsItem.classList.add('alt');
        newsMetaPhoto.style.backgroundImage = `url(${item.urlToImage || './assets/city.jpeg'})`;
        newsMetaAuthor.textContent = item.author || item.source.name;
        newsMetaDate.textContent = item.publishedAt.slice(0, 10).split('-').reverse().join('-');

        newsTitle.textContent = item.title;
        newsSource.textContent = item.source.name;
        newsContent.textContent = item.description;
        newsLink.setAttribute('href', item.url);

        fragment.append(newsClone);
      }
    });

    const newsBox: Nullable<HTMLElement> = document.querySelector('.news');
    if (isNull(newsBox)) {
      throw new Error('newsBox element is null');
    }

    newsBox.innerHTML = '';
    newsBox.appendChild(fragment);

    if (news.length === 0) {
      plug.classList.remove('hidden');
      plug.innerText = `There's no such news...`;
    }
  }
}

export default News;
