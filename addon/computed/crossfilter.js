import CrossfilterComputed from './-crossfilter/computed';
import Crossfilter from './-crossfilter/crossfilter-model';

export default function crossfilter() {
  return new CrossfilterComputed(function(key) {
    let { accessor, dimensions, groups, from } = this.constructor.metaForProperty(key).crossfilter;

    return Crossfilter.create({
      content: this,
      accessor,
      dimensions,
      groups,
      raw: this.get(from)
    });
  });
}

