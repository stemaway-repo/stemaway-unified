/* global settings */

export default <template>
<section class='universities'>
  <div class='universities-container'>
    <div class='university-title'>
      <h2>
        {{settings.universities_title}}
      </h2>
    </div>
    <div class='university-images'>
      <a href={{settings.university_1_url}} target='_blank' rel="noopener noreferrer">
        <img src={{settings.university_1_image}} alt='' />
      </a>
      <a href={{settings.university_2_url}} target='_blank' rel="noopener noreferrer">
        <img src={{settings.university_2_image}} alt='' />
      </a>
      <a href={{settings.university_3_url}} target='_blank' rel="noopener noreferrer">
        <img src={{settings.university_3_image}} alt='' />
      </a>
      <a href={{settings.university_4_url}} target='_blank' rel="noopener noreferrer">
        <img src={{settings.university_4_image}} alt='' />
      </a>
      <a href={{settings.university_5_url}} target='_blank' rel="noopener noreferrer">
        <img src={{settings.university_5_image}} alt='' />
      </a>
      <a href={{settings.university_6_url}} target='_blank' rel="noopener noreferrer">
        <img src={{settings.university_6_image}} alt='' />
      </a>
    </div>
  </div>
</section>
</template>
