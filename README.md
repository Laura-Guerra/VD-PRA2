# Basic Site Template :desktop_computer:

This basic site has been made with the idea of being able to use it as a template for future projects. Made with Angular, several components have been created for different pages applicable to a **portfolio or wiki**: home, letter grid, letter detail, contact and error page.

This project has been designed keeping in mind the need for it to be **responsive** so that it can be displayed on any device, be it a computer screen, tablet or mobile. For this reason, it has been ensured that the project can be displayed correctly up to 320px.

![basic-layouts](https://user-images.githubusercontent.com/36458569/180611008-6ea6a832-a50f-4604-a2d0-e5f7ac11a91e.png)

The deployed project can be visited here: https://yasmingimenezm-basic-site.vercel.app/

<p align="center">
  <kbd>
  <img style="margin:400px" src="https://user-images.githubusercontent.com/36458569/180641097-b93f4801-967d-4535-8ace-176d42e84f78.gif"/>
  </kbd>
</p>

## Used technologies :woman_technologist:	

### General :page_facing_up:	

These are the versions of the different technologies used in the project:

- **Angular CLI:** 14.0.6
- **Typescript:** 4.7.4
- **Node:** 16.15.1
- **Package Manager:** npm 8.11.0
- **OS:** win32 x64

### Angular Material :black_square_button:

Betting on responsiveness, **Angular Material** has been used to make the upper **ToolBar** that encompasses the header. In this way, we have two drop-down menus: one for the multilanguage and another for the page menu. In this way it is easier for us to implement the responsiveness of the web.

In addition, the **form** provided by **Angular Material** has also been used for its ease of use and its style. We used version 14.0.5.

### ngx-translate :earth_africa:

In order to include the multilanguage on the web, we have used **ngx-translate** (which you can visit on Github [here](https://github.com/ngx-translate/core)). Thanks to **ngx-translate** we can translate the content of the page into as many languages as we want, for this we have created different **.json** files that include the translations and, through **pipes**, we have included these translations in the different sections of the web.

## How do I use this project? ❓

Easy! Just download it in your computer and run the following command: ```npm install``` so you have the necessary node modules for executing the project.

## Development server & build :hammer_and_wrench:

**Development server** :computer:

Run ```ng serve``` for a dev server. Navigate to http://localhost:4200/. The application will automatically reload if you change any of the source files.

**Build** :gear:

Run ```ng build``` to build the project. The build artifacts will be stored in the ```dist/``` directory.


