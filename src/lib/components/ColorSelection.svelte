<script lang="ts">

    export let mode: string;
    

</script>

<!-- container -->
<div class="flex justify-start space-x-10 mt-8 ">

    <!-- button outline color -->
    <div>
      <label for="Outline Color" class="label">
        <span class="label-text font-input-mono">Outline Color</span>
      </label>      
      <div id="Outline Color" class="join">

          <!-- show outline color / clikc for color picker -->
          <button 
            style={`background-color: ${buttonBorderHexWithOpacity? buttonBorderHexWithOpacity : 'white'}`}
            on:click={() => {toggleShowButtonColorPicker(); mode = 'borderColor'}} 
            class="btn w-1/4 rounded-md"></button>

          <!-- select shade -->
          <select placeholder={buttonBorderShade} bind:value={buttonBorderShade} on:change={() => updateBorderColor(buttonBorderShade, buttonBorderValue)} class="select select-bordered">
            <option>slate</option>
            <option>gray</option>
            <option>zinc</option>
            <option>neutral</option>
            <option>stone</option>
            <option>red</option>
            <option>orange</option>
            <option>amber</option>
            <option>yellow</option>
            <option>lime</option>
            <option>green</option>
            <option>emerald</option>
            <option>teal</option>
            <option>cyan</option>
            <option>sky</option>
            <option>blue</option>
            <option>indigo</option>
            <option>violet</option>
            <option>purple</option>
            <option>fuchsia</option>
            <option>pink</option>
            <option>rose</option>
          </select>

          <!-- select value -->
          <select bind:value={buttonBorderValue} on:change={() => updateBorderColor(buttonBorderShade, buttonBorderValue)} class="select select-bordered">
            <option>50</option>
            <option>100</option>
            <option>200</option>
            <option>300</option>
            <option>400</option>
            <option>500</option>
            <option>600</option>
            <option>700</option>
            <option>800</option>
            <option>900</option>
            <option>950</option>
          </select>
      </div>
    </div>

    <!-- opacity -->
    <div class="form-control">
      <label for="opacity" class="label">
        <span class="label-text font-input-mono">Opacity</span>
      </label>
      <label class="input-group">
        <input type="text" min="0" max="100" id="opacity" bind:value={buttonBorderOpacity} on:change={() => updateBorderOpacity()} class="input input-bordered w-1/2" />
        <span>%</span>
      </label>
    </div>


<!-- end container -->
</div>