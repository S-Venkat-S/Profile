import React, { Component } from 'react';
import styles from "./about.module.css"

class About extends Component {

  constructor() {
    super()
  }

  render() {
    return (
      <div className={styles.container} >
        <p className={styles.name}>Hello, I'm Venkatesh.</p>
        <p className={styles.about}>Software developer in frontend and backend web apps and hybrid mobile apps.</p>
        <p className={styles.skills}>Check out my Skills and Works.</p>
      </div>
    )
  }
}
export default About;
