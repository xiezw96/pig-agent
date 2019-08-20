import F2 from '@antv/f2/lib/core';

import '@antv/f2/lib/coord/polar';
import '@antv/f2/lib/geom/adjust/stack';
import '@antv/f2/lib/geom/interval';

import Legend from '@antv/f2/lib/plugin/legend';
import PieLabel from '@antv/f2/lib/plugin/pie-label';

F2.Chart.plugins.register(Legend);
F2.Chart.plugins.register(PieLabel);
