import './news.css';
import { Article, isType, Nullable, getElementInFragment, isNull, INews } from '../../../types/types';

class News implements INews {
  public draw(data: Article[]): void {
    const news: Article[] = data.length >= 10 ? data.filter((_item, idx) => idx < 10) : data;

    const fragment: DocumentFragment = document.createDocumentFragment();

    const newsItemTemp: Nullable<HTMLTemplateElement> = document.querySelector('#newsItemTemp');
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
        const newsItem = getElementInFragment<HTMLElement>('.news__item', newsClone);
        const newsMetaPhoto = getElementInFragment<HTMLElement>('.news__meta-photo', newsClone);
        const newsMetaAuthor = getElementInFragment<HTMLElement>('.news__meta-author', newsClone);
        const newsMetaDate = getElementInFragment<HTMLElement>('.news__meta-date', newsClone);
        const newsTitle = getElementInFragment<HTMLElement>('.news__description-title', newsClone);
        const newsSource = getElementInFragment<HTMLElement>('.news__description-source', newsClone);
        const newsContent = getElementInFragment<HTMLElement>('.news__description-content', newsClone);
        const newsLink = getElementInFragment<HTMLElement>('.news__read-more a', newsClone);

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
