<?php
/**
 * Creates ArchSelect panel
 */
?>

            <div class="search_window">
            	
                <div class="window_closebar">
                    <span class="window_title">Phrase/Word Search</span>
                    <span class="window_close" />
                </div>
                
                <div class="window_body">
                	<div class="search_window_content">
                    <label>Search for a WORD or PHRASE:</label>
                    <input class="searchText"/>
                    <button class="search_button">Go</button>
                       <div class="match">
                            <input class="windowSwitch" type="checkbox"/>
                            <label class="wsLabel">Exact Match</label>
                        </div>
                    <label>Results:</label>
                    	<ul class="listBox"> </ul>
                    
                    <div class="limitBox">
                        <div class="Limiter_limitSpace"/>
                            <div class="Limiter_addLimit">
                                <label>Add limit</label>
                                <select name="limitType">
                                <option value="quarto">quarto</option>
                                <option value="speaker">speaker</option>
                                <option value="act">act</option>
                                <option value="scene">scene</option>
                                </select>
                                <span class="limiter_button">Add</span>
                                <span class="limiter_button">Remove All</span>
                                <span class="limiter_button">Search Again</span>
                            </div>
                        </div>
                    </div>
                        
                    </div>
                </div>
                
			
