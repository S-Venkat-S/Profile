import React, { Component } from 'react';
import styles from "./skills.module.css"

class Skills extends Component {

  constructor() {
    super()
    this.skills = {
      server: [
        ["Python", "90%"],
        ["Java", "90%"],
        ["NodeJS", "80%"],
        ["SQL", "70%"]
      ],
      client: [
        ["HTML & CSS", "70%"],
        ["Javascript", "90%"],
        ["React", "80%"],
        ["jQuery", "90%"]
      ],
    }
  }

  renderSkill(skill, precent) {
    return(
      <div className={styles.skillContainer}>
        <span>{skill}</span>
        <div className={styles.skillProgress}>
          <div className={styles.skillBar} style={{width: precent}}></div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.column}>
          <span>Client Side</span>
          {this.skills.client.map((i)=>this.renderSkill(i[0], i[1]))}
        </div>
        <div className={styles.column}>
          <span>Server Side</span>
          {this.skills.server.map((i)=>this.renderSkill(i[0], i[1]))}
        </div>
      </div>
    )
  }
}
export default Skills;
