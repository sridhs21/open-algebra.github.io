import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Open Source',
    Svg: require('@site/static/img/Elephant.svg').default,
    description: (
      <>
        OASIS is an open source project maintained by a dedicated group of
        RPI students.
      </>
    ),
  },
  {
    title: 'Focus on What Matters',
    Svg: require('@site/static/img/Flamingo.svg').default,
    description: (
      <>
        O.A.S.I.S lets you focus on getting math done quickly. To learn how to use
        our program, head over to the <code>Tutorial</code>.
      </>
    ),
  },
  {
    title: 'Powered by React',
    Svg: require('@site/static/img/Camel.svg').default,
    description: (
      <>
        Extend or customize your website layout by reusing React.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
