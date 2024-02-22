import './news.css';
import { Article, isType, Nullable, getElementInFragment, isNull, INews } from '../../../types/types';

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
    const news: Article[] = data.length >= 10 ? data.filter((_item, idx) => idx < 10) : data;

    const fragment: DocumentFragment = document.createDocumentFragment();

    const newsItemTemp: Nullable<HTMLTemplateElement> = document.querySelector(ArticleSelectors.NewsItemTempSel);
    console.log('newsItemTemp=', newsItemTemp);
    if (!isType<HTMLTemplateElement>(newsItemTemp, HTMLTemplateElement) || isNull(newsItemTemp)) {
      throw new Error();
    }

    news.forEach((item: Article, idx: number) => {
      const newsClone: Node = newsItemTemp.content.cloneNode(true);
      //   console.log('newsClone=', newsClone);
      //   console.log('item=', item);

      if (newsClone instanceof DocumentFragment) {
        // console.log('true');
        const newsItem = getElementInFragment<HTMLElement>(ArticleSelectors.NewsItemSel, newsClone);
        const newsMetaPhoto = getElementInFragment<HTMLElement>(ArticleSelectors.NewsItemPhoto, newsClone);
        const newsMetaAuthor = getElementInFragment<HTMLElement>(ArticleSelectors.NewsAuthorSel, newsClone);
        const newsMetaDate = getElementInFragment<HTMLElement>(ArticleSelectors.NewsDateSel, newsClone);
        const newsTitle = getElementInFragment<HTMLElement>(ArticleSelectors.NewsTitleSel, newsClone);
        const newsSource = getElementInFragment<HTMLElement>(ArticleSelectors.NewsSourceSel, newsClone);
        const newsContent = getElementInFragment<HTMLElement>(ArticleSelectors.NewsContentSel, newsClone);
        const newsLink = getElementInFragment<HTMLElement>(ArticleSelectors.NewsLinkSel, newsClone);

        if (idx % 2) newsItem.classList.add('alt');

        newsMetaPhoto.style.backgroundImage = `url(${item.urlToImage || 'img/news_placeholder.jpg'})`;
        newsMetaAuthor.textContent = item.author || item.source.name;
        newsMetaDate.textContent = item.publishedAt.slice(0, 10).split('-').reverse().join('-');

        newsTitle.textContent = item.title;
        newsSource.textContent = item.source.name;
        newsContent.textContent = item.description;
        newsLink.setAttribute('href', item.url);

        fragment.append(newsClone);
        console.log('fragment=', fragment);
      }
    });

    const newsBox: Nullable<HTMLElement> = document.querySelector('.news');
    if (isNull(newsBox)) {
      throw new Error();
    }

    console.log('news=', newsBox);

    newsBox.innerHTML = '';
    newsBox.appendChild(fragment);
    console.log('news=', newsBox);
  }
}

export default News;
