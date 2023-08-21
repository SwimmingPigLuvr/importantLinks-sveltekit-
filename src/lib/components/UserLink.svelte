<script lang="ts">
  import { buttonStyles } from "$lib/theme";
  import { onMount } from "svelte";

    export let iconURL = 'https://miladymaker.net/images/milady3.jpg';
    export let iconURLalt = 'ha';
    export let url = 'foo';
    export let title = 'some cool title';
    export let previewMode = false;
    export let buttonStyle: keyof typeof buttonStyles;
    export let buttonColor: string = '';
    export let font: string = 'font-elven';
    export let buttonFontColor: string = '';
    let tests = `${buttonFontColor} ${font}`;

    export let testColor: string = '';

    
    let textColorClass = ``; // or whatever color you want

  $: fullColor = previewMode ? 'text-[1rem]' : 'text-[1.5rem]';
  $: classes = `${fullColor} absolute ${textColorClass} font-${font} text-center`;

  onMount(() => {
    console.log('testColor: ', testColor);
  })


    
    let buttonRadius = '';
    let fill = false;
    let outline = false;
    let shadow = false;


    

    $: if (buttonStyle in buttonStyles) {
    let style = buttonStyles[buttonStyle];
    buttonRadius = style.buttonRadius;
    fill = style.fill;
    outline = style.outline;
    shadow = style.shadow;
    console.log(`Button style: ${buttonStyle}`);
  }
  
</script>

     <!-- if fill then bg-{buttonColor ? {buttonColor} : 'secondary'}, -->
<a 
  href="{url}" 
    class="{previewMode ? 'h-[43px]  p-[0.1rem] lg:max-w-[100%]' : 'md:max-w-2xl p-[0.4rem]'} m-auto max-w-[94%] 
     {buttonRadius === 'full' ? 'rounded-full' : buttonRadius === 'none' ? 'rounded-none' : 'rounded-[0.5rem]'} border-2  
     {fill ? `bg-${buttonColor ? buttonColor : 'secondary'}` : 'bg-opacity-0'}
     {outline ? `border-${buttonColor ? buttonColor : 'secondary'}` : 'border-transparent'}
     {shadow ? `shadow-xl shadow-${buttonColor ? buttonColor : 'secondary'}` : 'shadow-none'}
     hover:translate-x-1 hover:translate-y-1 stack text-center 
     flex justify-between items-center no-underline relative">
    <img 
      
      src={iconURL} 
      alt={iconURLalt} 
      class="{previewMode? 'h-8 w-8' : ''} w-12 h-12 {buttonRadius === 'full' ? 'rounded-full' : buttonRadius === 'none' ? 'rounded-none' : 'rounded-[0.23rem]'}">
    <span 
      class={classes}>{title}</span>
</a>

