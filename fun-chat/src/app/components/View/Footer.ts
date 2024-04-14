import BaseComponent from './BaseComponent';
import { Props } from '../../utils/types';
import { githubSvg, rssSvg } from '../../utils/icons';

export default class Footer extends BaseComponent {
  constructor(props: Props) {
    super(props);
    this.createView();
  }
  protected createView() {
    const iconGithub = new BaseComponent({ tag: 'a', classNames: ['icon-github'] });
    iconGithub.attr('href', 'https://github.com/gryzun33');
    iconGithub.attr('target', '_blank');
    iconGithub.html(githubSvg);
    const year = new BaseComponent({ tag: 'p', classNames: ['year'] });
    year.html(`&copy;2024`);
    const iconSchool = new BaseComponent({ tag: 'a', classNames: ['icon-school'] });
    iconSchool.attr('href', 'https://rs.school/');
    iconSchool.attr('target', '_blank');
    iconSchool.html(rssSvg);
    this.append(iconGithub, year, iconSchool);
  }
}
