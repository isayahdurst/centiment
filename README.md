# Centiment

![Centiment](/public/images/favicon.png)

## Table of Contents

-   [Project-Screenshot](#Preview)
-   [Description](#Description)
-   [Install](#Install)
-   [Usage](#Usage)
-   [License](#License)
-   [Contribute](#Contribute)
-   [Tests](#Tests)
-   [Contact](#Contact)
-   [Link to Site](#Link)

<a name="Description"></a>

## Preview

![Centiment-Preview](/public/images/centiment-preview.JPG)

## Description

Welcome to Centiment, the social media platform where you can connect with like-minded individuals and engage in meaningful discussions about the topics that matter to you. Our platform operates on a unique model where users can purchase access to communities using platform tokens.
What sets us apart from other social media platforms is that the value of each community fluctuates based on how many people purchase access. This means that the more popular a community is, the more valuable it becomes. As a result, users have the option to sell their access to a community for a profit if they choose to do so.
Not only does this model encourage users to participate in and contribute to meaningful discussions, it also incentivizes the creation of high-quality content and fosters a sense of ownership and investment in the communities they are a part of.
With Centiment, you can discover and join communities that align with your interests and passions, and engage with others who share your perspective. Plus, with the ability to earn tokens and potentially profit from your involvement in a community, the possibilities are endless.

<a name="Install"></a>

## Install

1. Download source code
2. Update environment variables: `.env`
3. install dependencies `npm install`
4. create db from `db\schema.sql`
   \*\*\* optional: you may seed DB with example data `npm seed`
5. run application `npm start`

    Note:

    - if you observe the connection error, check the version of `node`
    - connection details should be updated:
        - rename `.env.EXAMPLE` to `.env`
        - Update user-specific data:
          {
          host: "localhost",
          user: "root",
          password: "",
          ...
          }

<a name="Usage"></a>

## Usage

Our goal while developing Centiment was to have enriching and quantifiable data around public sentiment and maybe make a few cents along the way.
Right now we have limited options when it comes to truly understanding public sentiment on global news and topics. Yes, we have Google search trends and we have what traditional news outlets delivering what they want us to hear, and Twitter which is on a downward trend itself.
We wanted to build a better Twitter that lets you see not only how many people are interested in something, but how interested and invested they are.

<a name="License"></a>

## License

![License badge](https://img.shields.io/static/v1?label=license&message=MIT&color=green)

This application is available under the license: MIT.

See the LICENSE file for more info. Full details available by link https://choosealicense.com/licenses/mit/.

<a name="Contribute"></a>

## Contribute

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

-   Fork the Project
-   Create your Feature Branch
-   Commit your Changes
-   Push to the Branch
-   Open Pull Request

<a name="Tests"></a>

## Tests

none

<a name="Contact"></a>

## Contact

-   [GitHub: elangworth](https://github.com/elangworth)
-   Email: e24murph@gmail.com
-   [GitHub: isayahdurst](https://github.com/isayahdurst)
-   Email: isayah@fungeapp.com
-   [GitHub: OlgaGav](https://github.com/OlgaGav)
-   Email: ogavby@gmail.com
-   [GitHub: lunchtimewhee](https://github.com/lunchtimewhee)
-   Email: anthonyrli1994@gmail.com
-   [GitHub: frankmng](https://github.com/frankmng)
-   Email: frankmhnguyen@gmail.com

<a name="Link"></a>

## Link to Live Site

[Centiment](https://centiment-inc.herokuapp.com/login)

[Centiment presentation](https://docs.google.com/presentation/d/1doXjq0lNEc2gZnXsCwHHFu_WMamtz0i4vEbb8kiA63M/edit?usp=sharing)
