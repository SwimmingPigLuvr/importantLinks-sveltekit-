<script lang="ts">

    export let iconURL = 'ha';
    export let icon = 'default';
    export let url = 'foo';
    export let title = 'some cool title';
    export let previewMode = false;
    export let font = '';
    export let buttonStyle: keyof typeof buttonStyles;
    export let buttonColor: string;
    export let buttonFontColor: string;


    let bgColorClass = 'bg-' + buttonFontColor;
    let textColorClass = 'text-' + buttonFontColor;

    
    let buttonRadius = '';
    let fill = false;
    let outline = false;
    let shadow = false;

    export const buttonStyles = {
      squareFill: {
        buttonRadius: 'none',
        fill: true,
        outline: false,
        shadow: false,
      },
      roundFill: {
        buttonRadius: '[0.5rem]',
        fill: true,
        outline: false,
        shadow: false,
      },
      circleFill: {
        buttonRadius: 'full',
        fill: true,
        outline: false,
        shadow: false,
      },
      squareOutline: {
        buttonRadius: 'none',
        outline: true,
        fill: false,
        shadow: false,
      },
      roundOutline: {
        buttonRadius: '[0.5rem]',
        outline: true,
        fill: false,
        shadow: false,
      },
      circleOutline: {
        buttonRadius: 'full',
        outline: true,
        fill: false,
        shadow: false,
      },
      squareShadow: {
        buttonRadius: 'none',
        shadow: true,
        fill: false,
        outline: false,
      },
      roundShadow: {
        buttonRadius: '[0.5rem]',
        shadow: true,
        fill: false,
        outline: false,
      },
      circleShadow: {
        buttonRadius: 'full',
        shadow: true,
        fill: false,
        outline: false,
      },
    };

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
    class="{previewMode ? 'h-[43px]  p-[0.1rem] lg:max-w-[100%]' : 'md:max-w-2xl p-[0.4rem]'} m-auto 
     {buttonRadius === 'full' ? 'rounded-full' : buttonRadius === 'none' ? 'rounded-none' : 'rounded-[0.5rem]'} border-2  
     {fill ? `bg-${buttonColor ? buttonColor : 'secondary'}` : 'bg-opacity-0'}
     {outline ? `border-${buttonColor ? buttonColor : 'secondary'}` : 'border-transparent'}
     {shadow ? `shadow-xl shadow-${buttonColor ? buttonColor : 'secondary'}` : 'shadow-none'}
     hover:translate-x-1 hover:translate-y-1 stack text-center 
     flex justify-between items-center no-underline relative">
    <img 
      
      src={iconURL} 
      alt={icon} 
      class="{previewMode? 'h-8 w-8' : ''} w-12 h-12 {buttonRadius === 'full' ? 'rounded-full' : buttonRadius === 'none' ? 'rounded-none' : 'rounded-[0.23rem]'}">
    <span 
      class="{previewMode ? 'text-[1rem]' : 'text-[1.5rem]'} absolute {textColorClass} font-{font} text-center">{title}</span>
</a>